import { Formatter, IFormatterOptions } from '@cucumber/cucumber';
import { vars } from '@src/global';
import fs from 'fs-extra';

export default class StepLoggerFormatter extends Formatter {
  constructor(options: IFormatterOptions) {
    super(options);

    this.on('test-step-finished', async (event) => {
        const { testCaseStartedId, result } = event;
      
        const stepText = event.testStep?.pickleStep?.text;
      
        if (stepText) {
          const resolvedText = vars.replaceVariables(stepText);
          const status = result?.status;
      
          const logLine = `🧾 Step: ${resolvedText} → Status: ${status}`;
          const logDir = 'test-results/step-logs';
          fs.ensureDirSync(logDir);
          const logFile = `${logDir}/${testCaseStartedId}.log`;
          fs.appendFileSync(logFile, logLine + '\n');
        }
      });
  }
}