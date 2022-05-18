import { LitElement, TemplateResult } from 'lit';
import { Observable } from 'rxjs';

export const ComponentsRegistryService = 'FES.ComponentsRegistry';

export interface ComponentsRegistryService {
  resolveComponent(tag: string, hasSSR?: boolean): Observable<string>;
  resolveTemplate(type: string, uid: string): TemplateResult | undefined;
  hydrateOnDemand(element: LitElement): Promise<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [ComponentsRegistryService]: ComponentsRegistryService;
  }
}
