declare global {
  interface ContentFields {
    component: undefined;
  }
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
