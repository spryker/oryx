import { Observable } from 'rxjs';

export const AppInitializerService = 'oryx.AppInitializerService';
export const AppInitializer = 'oryx.AppInitializer*';

type AppInitialize = () => void | Observable<void> | Promise<void>;

export interface AppInitializerService {
  initialize(): Promise<void>;
}

export interface AppInitializer {
  initialize: AppInitialize;
}

declare global {
  interface InjectionTokensContractMap {
    [AppInitializerService]: AppInitializerService;
    [AppInitializer]: AppInitializer | AppInitialize;
  }
}
