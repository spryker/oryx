declare global {
  interface ContentFields {
    component: undefined;
  }
}

/**
 * @deprecated since 1.4 will be removed. Use ContentFields interface instead.
 */
export const enum ContentFields {
  Article = 'article',
  Faq = 'faq',
  Component = 'component',
}

// Object is workaround for autocomplete. Typescript incorrect parse metadata when define union and strict type.
// Opened issue https://github.com/Microsoft/TypeScript/issues/29729
// eslint-disable-next-line @typescript-eslint/ban-types
export type ContentEntity = keyof ContentFields | (string & {});

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
  type: string;
  name?: string;
}
