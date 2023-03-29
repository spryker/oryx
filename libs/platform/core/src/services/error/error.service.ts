import { OnDestroy } from '@spryker-oryx/di';
import { AppInitializer } from '../app-initializer';

export interface ErrorService extends AppInitializer, OnDestroy {
  dispatchError(error: ErrorEvent | PromiseRejectionEvent): void;
}

export const ErrorService = 'oryx.ErrorService';

declare global {
  interface InjectionTokensContractMap {
    [ErrorService]: ErrorService;
  }
}
