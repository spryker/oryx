import { ElementAttributes, ElementDefinition } from './page-meta.model';

export const PageMetaService = 'oryx.PageMetaService';

export interface PageMetaService {
  add(definitions: ElementDefinition | ElementDefinition[]): void;
  update(definition: ElementDefinition): void;
  setAttributes(attrs: ElementAttributes, element: HTMLElement): void;
}

declare global {
  interface InjectionTokensContractMap {
    [PageMetaService]: PageMetaService;
  }
}
