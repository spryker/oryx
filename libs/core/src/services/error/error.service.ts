export interface ErrorService {
  initialize(): void;
}

export const ErrorService = 'FES.ErrorService';

declare global {
  interface InjectionTokensContractMap {
    [ErrorService]: ErrorService;
  }
}
