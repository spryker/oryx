import { CmsQualifier } from './cms-qualifier';

export module ApiCmsModel {
  export interface Response<T = unknown> {
    items: {
      sys: {
        contentType: { sys: { id: string } };
      };
      fields: T & {
        id: string;
      };
    }[];
  }

  export interface Model<T = Record<string, unknown>> {
    data: Response<T>;
    qualifier: CmsQualifier;
  }
}
