export module ContentfulCmsModel {
  export interface Type {
    disabled: boolean;
    id: string;
    localized: boolean;
    name: string;
    omitted: boolean;
    required: boolean;
    type: string;
  }

  export interface Locale {
    code: string;
    contentDeliveryApi: boolean;
    contentManagementApi: boolean;
    default: boolean;
    fallbackCode: string;
    internal_code: string;
    name: string;
    optional: boolean;
  }

  export type Entry = Record<string, unknown>;

  export interface SimpleResponse<T> {
    sys: {
      contentType: { sys: { id: string } };
      version: number;
      id: string;
    };
    fields: T;
  }

  export interface Response<T> {
    items: SimpleResponse<T>[];
  }

  export type TypesResponse = Response<Type[]>;
  export type EntriesResponse = Response<Entry>;
  export type LocalesResponse = { items: Locale[] };
}
