import { CmsQualifier } from './cms-qualifier';

export module ApiCmsModel {
  export interface Response {
    items: {
      sys: {
        contentType: { sys: { id: string } };
        version: number;
        id: string;
      };
      fields: Entry;
    }[];
  }

  export interface Entry {
    fields: ContentField[];
    sys: {
      contentType: { sys: { id: string } };
      version: number;
      id: string;
    };
  }

  export interface ContentField {
    disabled: boolean;
    id: string;
    localized: boolean;
    name: string;
    omitted: boolean;
    required: boolean;
    type: string;
  }

  export interface ContentType extends Entry {
    description: string;
    displayField: string;
    name: string;
  }

  export interface ContentTypes {
    items: ContentType[];
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

  export interface Locales {
    items: Locale[];
  }

  export interface Model {
    data: Response;
    qualifier: CmsQualifier;
    locale: string;
    type: Record<string, ContentField>;
  }
}
