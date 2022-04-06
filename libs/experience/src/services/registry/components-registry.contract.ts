import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Services } from '../services';

export interface ComponentsRegistryContract {
  resolveComponent(tag: string): Observable<string>;
  resolveTemplate(type: string, uid: string): TemplateResult | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [Services.ComponentsRegistry]: ComponentsRegistryContract;
  }
}
