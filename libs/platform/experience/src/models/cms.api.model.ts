import { CmsQualifier } from './cms-qualifier';

export module ApiCmsModel {
  export interface Response {
    items: {
      sys: {
        contentType: { sys: { id: string } };
        version: number;
      };
      fields: Entry;
    }[];
  }

  export interface Entry {
    fields: ContentField[];
    sys: {
      contentType: { sys: { id: string } };
      version: number;
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

  export interface Model {
    data: Response;
    qualifier: CmsQualifier;
    locale: string;
    type: ContentTypes;
  }
}
