export interface ErrorService {
  initialize(): void;
  dispatchError(error: ErrorEvent | PromiseRejectionEvent): void;
}

export const ErrorService = 'oryx.ErrorService';

declare global {
  interface InjectionTokensContractMap {
    [ErrorService]: ErrorService;
  }
}
