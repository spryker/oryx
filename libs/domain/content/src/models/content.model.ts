export const enum ContentFields {
  Article = 'article',
  Faq = 'faq',
  Component = 'component',
}

export type ContentEntity = ContentFields | string;

export interface ContentQualifier {
  type?: string;
  id?: string;
  query?: string;
  entities?: ContentEntity[];
}

export interface ContentField {
  [key: string]: unknown;
  id: string;
}

export interface Content<T = Record<string, unknown>> {
  fields: T & ContentField;
  id: string;
  version: number;
  type: string;
}
