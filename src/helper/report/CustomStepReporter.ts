import { Formatter, IFormatterOptions } from '@cucumber/cucumber';
import fs from 'fs-extra';
import path from 'path';
import { vars } from '@src/global';

class CustomStepReporter extends Formatter {
  constructor(options: IFormatterOptions) {
    super(options);

    console.log('🎯 CustomStepReporter active');

    options.eventBroadcaster.on('test-step-finished', async (event) => {
      const { testStep, result, testCaseStartedId } = event;
      console.log('📍 test-step-finished triggered');
    
      const stepText = testStep?.pickleStep?.text;
      console.log('🧾 Raw step text:', stepText);
    
      if (!stepText || typeof stepText !== 'string' || stepText.trim() === "") {
        console.warn('⚠️ Skipping step logging: invalid or empty stepText');
        return;
      }
    
      const resolved = vars.replaceVariables(stepText);
      console.log('🧠 Resolved step:', resolved);
    
      const status = result?.status;
      const logLine = `📝 Step: ${resolved} → Status: ${status}`;
      const logDir = path.resolve('test-results/custom-report');
      fs.ensureDirSync(logDir);
      const filePath = path.join(logDir, `${testCaseStartedId}.log`);
    
      console.log(`📄 Logging to: ${filePath}`);
      fs.appendFileSync(filePath, logLine + '\n');
    });
  }
}

// ✅ Export as CommonJS to ensure compatibility with Cucumber formatter loader
module.exports = CustomStepReporter;