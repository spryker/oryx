import { ElementAttributes, ElementDefinition } from './page-head.model';

export const PageHeadService = 'oryx.PageHeadService';

export interface PageHeadService {
  addElements(definitions: ElementDefinition | ElementDefinition[]): void;
  updateElement(definition: ElementDefinition): void;
  updateHtmlElement(attrs: ElementAttributes): void;
  setAttributes(attrs: ElementAttributes, element: HTMLElement): void;
}

declare global {
  interface InjectionTokensContractMap {
    [PageHeadService]: PageHeadService;
  }
}
