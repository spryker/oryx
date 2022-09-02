import { LitElement, TemplateResult } from 'lit';
import { ComponentLayout } from '../experience';

export const ComponentsRegistryService = 'FES.ComponentsRegistry';

export interface ComponentsRegistryService {
  resolveTemplate(
    type: string,
    uid: string,
    layout?: ComponentLayout
  ): TemplateResult | undefined;
  hydrateOnDemand(element: LitElement): Promise<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [ComponentsRegistryService]: ComponentsRegistryService;
  }
}
