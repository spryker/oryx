export module ContentfulCmsModel {
  export interface LinkAsset {
    sys: {
      id: string;
      linkType: 'Asset';
      type: string;
    };
  }

  export interface Type {
    disabled: boolean;
    id: string;
    localized: boolean;
    name: string;
    omitted: boolean;
    required: boolean;
    type: string;
  }

  export interface Asset {
    description: string;
    title: string;
    file: {
      contentType: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      url: string;
    };
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
    fields: T & { id: string };
  }

  export interface Response<T> {
    items: SimpleResponse<T>[];
  }

  export type TypesResponse = Response<Type[]>;
  export type EntriesResponse = Response<Entry>;
  export type AssetsResponse = Response<Asset>;
  export type LocalesResponse = { items: Locale[] };
}
