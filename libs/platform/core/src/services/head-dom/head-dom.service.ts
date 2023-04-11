export const HeadDOMService = 'oryx.HeadDOMService';

interface LinkAttributes {
  rel?: string;
  href?: string;
  sizes?: string;
}

interface TitleAttributes {
  text: string;
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

export type TagAttributes =
  | Record<string, string>
  | MetaAttributes
  | TitleAttributes
  | LinkAttributes;

export interface TagDefinition {
  name: string;
  attrs: TagAttributes;
}

export interface HeadDOMService {
  addTags(tags: TagDefinition[]): void;
  addTag(tag: TagDefinition): void;
  updateTag(tag: TagDefinition): void;
}

declare global {
  interface InjectionTokensContractMap {
    [HeadDOMService]: HeadDOMService;
  }
}
