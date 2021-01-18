// src/index.ts
import { timeout } from './Utils/timeout';
import { logger, LogMode } from './Library/Logger';

/**
 * Logs a greeting for the name after a 1.5 second delay.
 * @param name User you are greeting
 */
async function sayHello(name = 'John'): Promise<void> {
  logger.log(LogMode.INFO, 'Waiting 1.5 seconds then saying Hi');

  await timeout(1500);

  logger.log(LogMode.INFO, `Hello ${name}!`);
}

logger.log(LogMode.INFO, `Starting TS-Core`);

await sayHello('K-FOSS');

export {};
