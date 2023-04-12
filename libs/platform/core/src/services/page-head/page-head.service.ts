import { ElementDefinition } from './page-head.model';

export const PageHeadService = 'oryx.PageHeadService';

export interface PageHeadService {
  addElements(definitions: ElementDefinition[]): void;
  addElement(definition: ElementDefinition): void;
  updateElement(definition: ElementDefinition): void;
}

declare global {
  interface InjectionTokensContractMap {
    [PageHeadService]: PageHeadService;
  }
}
