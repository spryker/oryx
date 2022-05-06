import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';

export const ComponentsRegistryService = 'FES.ComponentsRegistry';

export interface ComponentsRegistryService {
  resolveComponent(tag: string): Observable<string>;
  resolveTemplate(type: string, uid: string): TemplateResult | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [ComponentsRegistryService]: ComponentsRegistryService;
  }
}
