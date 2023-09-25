import { Observable } from 'rxjs';

export const AppInitializerService = 'oryx.AppInitializerService';
export const AppInitializer = 'oryx.AppInitializer*';

export interface AppInitializerService {
  initialize(): Promise<void>;
}

export interface AppInitializer {
  initialize(): void | Observable<void> | Promise<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [AppInitializerService]: AppInitializerService;
    [AppInitializer]:
      | AppInitializer
      | (() => void | Observable<void> | Promise<void>);
  }
}
