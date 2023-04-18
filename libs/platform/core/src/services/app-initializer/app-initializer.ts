import { Observable } from 'rxjs';

export const AppInitializerService = 'oryx.AppInitializerService';
export const AppInitializer = 'oryx.AppInitializer*';

export interface AppInitializerService {
  initialize(): Promise<void>;
}

export interface AppInitializer {
  initialize(): void | Observable<unknown> | Promise<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [AppInitializerService]: AppInitializerService;
    [AppInitializer]: AppInitializer;
  }
}
