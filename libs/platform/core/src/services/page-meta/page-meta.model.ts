interface LinkAttributes {
  rel?: string;
  href?: string;
  sizes?: string;
  async?: boolean;
  defer?: boolean;
}

interface TextAttributes {
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
  extends TextAttributes,
    MetaAttributes,
    LinkAttributes {
  [key: string]: string | undefined | boolean;
}

export interface ElementDefinition {
  name: 'link' | 'style' | 'title' | 'script' | 'html' | 'meta' | string;
  attrs: ElementAttributes;
}
