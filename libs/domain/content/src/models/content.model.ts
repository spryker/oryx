export interface ContentQualifier {
  type?: string;
  id?: string;
  query?: string;
  entities?: string[];
}

export interface Content<T = Record<string, unknown>> {
  fields: T & {
    id: string;
  };
  id: string;
  version: number;
  type: string;
}
