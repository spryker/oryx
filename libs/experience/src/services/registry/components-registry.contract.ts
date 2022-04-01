import { Observable } from 'rxjs';
import { Services } from '../services';

export interface ComponentsRegistryContract {
  resolveComponent(tag: string): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [Services.ComponentsRegistry]: ComponentsRegistryContract;
  }
}
