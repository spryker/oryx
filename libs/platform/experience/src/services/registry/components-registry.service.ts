import { TemplateResult } from 'lit';

export const ComponentsRegistryService = 'oryx.ComponentsRegistry';

export interface ComponentTemplate {
  type: string;
  uid: string;
  markers?: string;
}

export interface ComponentsRegistryService {
  resolveTemplate(data: ComponentTemplate): TemplateResult | undefined;
  resolveTag(type: string): string;
}

declare global {
  interface InjectionTokensContractMap {
    [ComponentsRegistryService]: ComponentsRegistryService;
  }
}
