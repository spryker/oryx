export interface ErrorHandler {
  handle(error: unknown): void;
}

export const ErrorHandler = 'oryx.ErrorHandler';

declare global {
  interface InjectionTokensContractMap {
    [ErrorHandler]: ErrorHandler;
  }
}
