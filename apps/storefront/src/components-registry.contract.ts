import { Observable } from 'rxjs';

export interface ComponentsRegistryContract {
  resolveComponent(tag: string): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    ['FES.ComponentsRegistry']: ComponentsRegistryContract;
  }
}
