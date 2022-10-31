import { Observable } from 'rxjs';

export interface ErrorHandler {
  handle(event: ErrorEvent | PromiseRejectionEvent): void;
  get?(): Observable<ErrorEvent | PromiseRejectionEvent | null>;
}

export const ErrorHandler = 'FES.ErrorHandler';

declare global {
  interface InjectionTokensContractMap {
    [ErrorHandler]: ErrorHandler;
  }
}
