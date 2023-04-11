export const HeadDOMService = 'oryx.HeadDOMService';

interface LinkAttributes {
  rel?: string;
  href?: string;
  sizes?: string;
}

interface TitleAttributes {
  text?: string;
}

interface MetaAttributes {
  charset?: string;
  content?: string;
  'http-equiv'?: string;
  id?: string;
  itemprop?: string;
  url?: string;
  name?: string;
}

export interface ElementAttributes
  extends TitleAttributes,
    MetaAttributes,
    LinkAttributes {
  [key: string]: string | undefined;
}

export interface ElementDefinition {
  name: string;
  attrs: ElementAttributes;
}

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
