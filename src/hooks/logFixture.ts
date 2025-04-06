import { Logger, createLogger } from 'winston';
import { options } from '../helper/util/logger';  // 👈 Reuse logger config from here

let logger: Logger;

export const logFixture = {
  init(scenarioName: string): void {
    logger = createLogger(options(scenarioName));  // 👈 Use the shared config
  },
  get(): Logger {
    if (!logger) throw new Error("Logger not initialized!");
    return logger;
  }
};


// // src/hooks/logFixture.ts
// import { Logger, createLogger, format, transports } from 'winston';

// let logger: Logger;

// export const logFixture = {
//   init(scenarioName: string): void {
//     logger = createLogger({
//       level: 'info',
//       format: format.combine(
//         format.timestamp(),
//         format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
//       ),
//       transports: [new transports.Console()]
//     });
//   },
//   get(): Logger {
//     if (!logger) throw new Error("Logger not initialized!");
//     return logger;
//   }
// };