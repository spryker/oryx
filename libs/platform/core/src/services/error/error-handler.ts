export interface ErrorHandler {
  handle(error: unknown): void;
}

export const ErrorHandler = 'FES.ErrorHandler';

declare global {
  interface InjectionTokensContractMap {
    [ErrorHandler]: ErrorHandler;
  }
}
