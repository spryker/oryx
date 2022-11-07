export interface ErrorHandler {
  handle(event: ErrorEvent | PromiseRejectionEvent): void;
}

export const ErrorHandler = 'FES.ErrorHandler';

declare global {
  interface InjectionTokensContractMap {
    [ErrorHandler]: ErrorHandler;
  }
}
