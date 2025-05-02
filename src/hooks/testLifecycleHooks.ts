import { getEnv } from '@helper/env/env';
import { webFixture,vars } from '@src/global';
import fs from 'fs-extra';

export async function setupEnvAndBrowser() {
  getEnv();
  console.log("runType:", globalThis.runType);
  if (globalThis.runType === 'ui') {
    await webFixture.launchBrowser();
  }
  if (vars.getValue("config.artifacts.cleanUpBeforeRun")){
    console.log("🧹 Cleaning up test-results folder...");
    const foldersToClean = [
        'test-results/scenarios',
        'test-results/videos',
        'test-results/screenshots',
        'test-results/trace'
      ];
      
      for (const folder of foldersToClean) {
        if (fs.existsSync(folder)) {
          fs.emptyDirSync(folder);
          console.log(`🧹 Cleaned: ${folder}`);
        }
      }
    // fs.emptyDirSync('test-results');
  }
}

export async function shutdownBrowser() {
  if (globalThis.runType === 'ui') {
    await webFixture.closeAll();
  }
}