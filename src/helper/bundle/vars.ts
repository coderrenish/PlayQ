import fs from 'fs';
import path from 'path';

const staticVars: Record<string, string> = {};
const runtimeVars: Record<string, string> = {};
const loggedMissingKeys = new Set<string>();
let hasLoadedVars = false;

const varDataPath = path.resolve('resources/variables.json');

// function loadStaticVars() {
//   if (Object.keys(staticVars).length > 0) return; // already loaded
//   try {
//     const rawData = fs.readFileSync(varDataPath, 'utf-8');
//     const parsed = JSON.parse(rawData);
//     Object.assign(staticVars, parsed);
//     console.log(`✅ Loaded static variables from ${varDataPath}`);
//   } catch (err) {
//     console.error(`❌ Failed to load static variables:`, err);
//   }
// }

function loadStaticVars(silent = false) {
    if (hasLoadedVars) return;
  
    try {
      const rawData = fs.readFileSync(varDataPath, 'utf-8');
      const parsed = JSON.parse(rawData);
      Object.assign(staticVars, parsed);
      if (!silent) {
        console.log(`✅ Loaded static variables from ${varDataPath} (PID: ${process.pid})`);
    }
    } catch (err) {
      console.error(`❌ Failed to load static variables:`, err);
    }
    hasLoadedVars = true;
  }

  
function getVar(key: string): string {
  if (key in runtimeVars) return runtimeVars[key];
  if (key in staticVars) return staticVars[key];

  if (!loggedMissingKeys.has(key)) {
    console.warn(`⚠️ Variable not found for key: "${key}"`);
    loggedMissingKeys.add(key);
  }

  return key;
}


function setVar(key: string, value: string): void {
  runtimeVars[key] = value;
}

function debugVars() {
  console.log('📦 Static Vars:', staticVars);
  console.log('🧠 Runtime Vars:', runtimeVars);
}

// Load once during module initialization
loadStaticVars();

export { getVar, setVar, debugVars, loadStaticVars };