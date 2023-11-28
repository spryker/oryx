export module StrapiCmsModel {
  export interface Entry {
    id: number;
    attributes: {
      [key: string]: unknown;
      locale: string;
      identifier: string;
      createdAt: string;
      publishedAt: string;
      updatedAt: string;
    };
  }

  export interface TypeAttributes {
    pluginOptions: {
      i18n: { localized: boolean };
    };
    type: string;
    unique?: boolean;
    required?: boolean;
  }

  export interface Type {
    uid: `api::${string}`;
    apiID: string;
    schema: {
      draftAndPublish: boolean;
      displayName: string;
      singularName: string;
      pluralName: string;
      description: string;
      pluginOptions: {
        i18n: { localized: boolean };
      };
      collectionName: string;
      attributes: Record<string, TypeAttributes>;
    };
  }

  export interface Meta {
    meta: {
      pagination?: {
        page: number;
        pageCount: number;
        pageSize: number;
        total: number;
      };
    };
  }

  export interface Response<D = unknown> {
    data: D;
  }

  export type EntriesResponse = Response<Entry[]> & Meta;
  export type EntryResponse = Response<Entry> & Meta;
  export type TypesResponse = Response<Type[]>;
}
