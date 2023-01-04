export interface ErrorService {
  initialize(): void;
  dispatchError(error: ErrorEvent | PromiseRejectionEvent): void;
}

export const ErrorService = 'FES.ErrorService';

declare global {
  interface InjectionTokensContractMap {
    [ErrorService]: ErrorService;
  }
}
