import fs from 'fs';
import path from 'path';

import { variable as importedVars } from '@resources/variable';
import { config as importedConfig } from '@resources/config';

const patternDirs = [
  path.resolve(__dirname, '../../../resources/locators/pattern'),
  path.resolve(__dirname, '../../../src/helper/addons/pattern')
];

const staticVars: Record<string, string> = {
  ...flattenConfig(importedVars, "var"),
  ...flattenConfig(importedConfig),
};
const runtimeVars: Record<string, string> = {};
const loggedMissingKeys = new Set<string>();

// validateVariableKeys(importedVars); 
loadPatternEntries(); // load Pattern entries


function getValue(key: string): string {
  if (key in runtimeVars) return runtimeVars[key];
  if (key in staticVars) return staticVars[key];

  if (!loggedMissingKeys.has(key)) {
    console.warn(`⚠️ Variable not found for key: "${key}"`);
    loggedMissingKeys.add(key);
  }

  return key;
}

function setValue(key: string, value: string): void {
  runtimeVars[key] = value;
}

function replaceVariables(input: string): string {
  return input.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    const value = this.getValue(varName);
    return value;
  });
}

function debugVars() {
  console.log('📦 Static Vars:', staticVars);
  console.log('🧠 Runtime Vars:', runtimeVars);
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
      entries[fullKey] = obj[key].join(','); // Store arrays as comma-separated strings
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
        .filter(file => file.endsWith('.ts'))
        .map(file => path.join(dir, file));
      files.push(...dirFiles);
    }
  }

  for (const file of files) {
    const fileName = path.basename(file, '.ts');
  
    if (!/^[a-zA-Z0-9_]+$/.test(fileName)) {
      throw new Error(`❌ Invalid pattern file name "${fileName}". Only alphanumeric characters and underscores are allowed.`);
    }
  
    const patternModule = require(file); // dynamic import
  
    const exported = patternModule[fileName] || patternModule.default?.[fileName];
    if (!exported) {
      throw new Error(`❌ Exported const '${fileName}' not found in: ${file}`);
    }
  
    const flattened = flattenConfig(exported, `pattern.${fileName}`);
    Object.assign(staticVars, flattened);
  }
  
}


export { getValue, setValue, replaceVariables, debugVars };