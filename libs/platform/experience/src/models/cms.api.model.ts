import { CmsQualifier } from './cms-qualifier';

export module ApiCmsModel {
  export type Response<T = Record<string, unknown>> = {
    items: {
      sys: {
        contentType: { sys: { id: string } };
      };
      fields: {
        [P in keyof T]: Record<string, T[P]>;
      } & {
        id: Record<string, string>;
      };
    }[];
  };

  export interface Model<T = Record<string, unknown>> {
    data: Response<T>;
    qualifier: CmsQualifier;
    locale: string;
  }
}
