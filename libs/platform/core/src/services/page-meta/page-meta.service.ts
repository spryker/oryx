import { ElementAttributes, ElementDefinition } from './page-meta.model';

export const PageMetaService = 'oryx.PageMetaService';

export interface PageMetaService {
  add(definitions: ElementDefinition | ElementDefinition[]): void;
  update(definition: ElementDefinition): void;
  setHtmlAttributes(attrs: ElementAttributes): void;
}

declare global {
  interface InjectionTokensContractMap {
    [PageMetaService]: PageMetaService;
  }
}
