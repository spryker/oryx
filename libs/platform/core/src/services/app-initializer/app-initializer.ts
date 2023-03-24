import { OnDestroy } from '@spryker-oryx/di';
import { Observable } from 'rxjs';

export const AppInitializerService = 'oryx.AppInitializerService';
export const AppInitializer = 'oryx.AppInitializer*';

export interface AppInitializerService extends OnDestroy {
  initialize(): void;
}

export interface AppInitializer {
  initialize(): void | Observable<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [AppInitializerService]: AppInitializerService;
    [AppInitializer]: AppInitializer;
  }
}
