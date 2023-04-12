import { ElementDefinition } from './head-dom.model';

export const HeadDOMService = 'oryx.HeadDOMService';

export interface HeadDOMService {
  addElements(definitions: ElementDefinition[]): void;
  addElement(definition: ElementDefinition): void;
  updateElement(definition: ElementDefinition): void;
}

declare global {
  interface InjectionTokensContractMap {
    [HeadDOMService]: HeadDOMService;
  }
}
