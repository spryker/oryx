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
  tags?: string[] | string;
  entities?: ContentEntity[];
}

export interface ContentMeta {
  id: string;
  type: string;
  name?: string;
}

/**
 * @deprecated Since version 1.4. Will be removed.
 */
interface DeprecatedContent {
  fields?: Record<string, unknown>;
  name?: string;
  id?: string;
  type?: string;
}

export type Content<T = Record<string, unknown>> = {
  _meta: ContentMeta;
  heading?: string;
  id: string;
  [key: string]: unknown;
} & T &
  DeprecatedContent;
