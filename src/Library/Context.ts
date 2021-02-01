// src/Library/Context.ts
import { ContainerInstance, Token, Container } from 'typedi';
import { logger, LogMode } from './Logger';

export interface Context {
  container: ContainerInstance;
}

export const contextToken = new Token<Context>('contextToken');

/**
 * Create Context Object.
 * @param context Context Object
 *
 * @returns Promise resolving to the Container object
 */
export function createContext(
  context: Context = {
    container: Container.of(),
  },
): Context {
  logger.log(LogMode.DEBUG, `createContext()`, context.container);

  context.container.set({
    id: contextToken,
    value: context,
    global: true,
  });

  Container.set({
    id: contextToken,
    value: context,
    global: true,
  });

  return context;
}
