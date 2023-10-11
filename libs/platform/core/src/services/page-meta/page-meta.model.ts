interface LinkAttributes {
  rel?: string;
  href?: string;
  sizes?: string;
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
  [key: string]: string | undefined;
}

export interface ElementDefinition {
  name: 'link' | 'style' | 'title' | 'script' | 'html' | 'meta' | string;
  attrs: ElementAttributes;
  /**
   * Disables adding additional link with preload rel attribute for better site speed.
   * Works only with link meta with stylesheet rel attribute.
   */
  disablePreload?: boolean;
  toBody?: boolean;
}
