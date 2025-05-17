import fs from 'fs';
import path from 'path';

import { variable as importedVars } from '@resources/variable';
import { config as importedConfig } from '@resources/config';

const patternDirs = [
  path.resolve(__dirname, '../../../resources/locators/pattern'),
  path.resolve(__dirname, '../addons/pattern')
];

const storedVars: Record<string, string> = {
  ...flattenConfig(importedVars, "var"),
  ...flattenConfig(importedConfig),
};
// const runtimeVars: Record<string, string> = {};
const loggedMissingKeys = new Set<string>();

// validateVariableKeys(importedVars); 
loadPatternEntries(); // load Pattern entries


function getValue(key: string): string {
  key = key.trim();
  // if (key in runtimeVars) return runtimeVars[key];
  if (key.startsWith("env.")) {
    const envKey = key.slice(4);
    const envValue = process.env[envKey];
    if (!envValue) {
      console.warn(`⚠️ Environment variable not found for key: "${envKey}"`);
      return key;
    }
    return envValue;
  }

  if (key in storedVars) return storedVars[key];

  if (!loggedMissingKeys.has(key)) {
    console.warn(`⚠️ Variable not found for key: "${key}"`);
    loggedMissingKeys.add(key);
  }

  return key;
}

function getConfigValue(key: string): string {
  key = 'config.'+key.trim();
  // if (key in runtimeVars) return runtimeVars[key];
  if (key in storedVars) return storedVars[key];

  if (!loggedMissingKeys.has(key)) {
    console.warn(`⚠️ Config Variable not found for key: "${key}"`);
    loggedMissingKeys.add(key);
  }
  return key;
}

function setValue(key: string, value: string): void {
  storedVars[key] = value;
}

function replaceVariables(input: string): string {
  return input.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    const value = this.getValue(varName);
    return value;
  });
}

function debugVars() {
  console.log('📦 Static Vars:', storedVars);
  // console.log('🧠 Runtime Vars:', runtimeVars);
}

// function validateVariableKeys(vars: Record<string, string>) {
//   const invalidKeys = Object.keys(vars).filter((key) => {
//     return !/^var\.[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(key);
//   });

//   if (invalidKeys.length > 0) {
//     throw new Error(
//       `❌ variables.ts: Invalid variable keys detected:\n${invalidKeys.join("\n")}\n\nEach key must:
// - Start with "var."
// - Only contain alphanumeric characters, "_" or "-"
// - No spaces or special characters`
//     );
//   }
// }

function flattenConfig(obj: any, prefix = 'config'): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const key in obj) {
    const fullKey = `${prefix}.${key}`;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(entries, flattenConfig(obj[key], fullKey));
    } else if (Array.isArray(obj[key])) {
      entries[fullKey] = obj[key].join(';'); // Store arrays as comma-separated strings
      // Store arrays as JSON strings to preserve structure
      // entries[fullKey] = JSON.stringify(obj[key]);
    } else {
      entries[fullKey] = String(obj[key]);
    }
  }
  return entries;
}

function loadPatternEntries() {
  const files: string[] = [];
  for (const dir of patternDirs) {
    if (fs.existsSync(dir)) {
      const dirFiles = fs.readdirSync(dir)
        .filter(file => {
          const isTS = file.endsWith('.pattern.ts');
          const isAddonDir = dir.includes('src/helper/addons/pattern');
          if (!isTS) return false;
          if (isAddonDir) return file.startsWith('_'); // only _ files in addon dir
          return !file.startsWith('_'); // exclude _ files in resources dir
        })
        .map(file => path.join(dir, file));
      files.push(...dirFiles);
    }
  }

  for (const file of files) {
    const fileName = path.basename(file, '.pattern.ts');
    if (!/^[a-zA-Z0-9_]+$/.test(fileName)) {
      throw new Error(`❌ Invalid pattern file name "${fileName}". Only alphanumeric characters and underscores are allowed.`);
    }
    const patternModule = require(file); // dynamic import
    const exported = patternModule[fileName] || patternModule.default?.[fileName];
    if (!exported) {
      throw new Error(`❌ Exported const '${fileName}' not found in: ${file}`);
    }
    const flattened = flattenConfig(exported, `pattern.${fileName}`);
    Object.assign(storedVars, flattened);
  }
  
}


export { getValue, getConfigValue, setValue, replaceVariables, debugVars };