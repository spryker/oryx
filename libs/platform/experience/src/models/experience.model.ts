import { CmsQualifier } from './cms-qualifier';
import { CompositionProperties } from './composition.model';

export const CmsToken = 'oryx.ContentfulSpace';

declare global {
  interface Environment {
    readonly ORYX_CMS_TOKEN?: string;
  }
}

export interface ComponentImage {
  src: string;
  alt?: string;
}

export interface ComponentData {
  items?: unknown;
}

export interface Component<
  Options = CompositionProperties,
  Content = Record<string, unknown>
> {
  id: string;
  name?: string;
  type: string;
  meta?: {
    route?: string;
    title?: string;
    description?: string;
    follow?: boolean;
    index?: boolean;
    [key: string]: string | boolean | undefined;
  };
  components?: Component[];
  options?: Options;
  content?: {
    data: Content;
  };
}

export type CmsEntry = Record<string, unknown> & {
  id: string;
  version: number;
};

export interface CmsModel<T = CmsEntry> {
  qualifier: CmsQualifier;
  items: (T & CmsEntry)[];
}

declare global {
  interface InjectionTokensContractMap {
    [CmsToken]: string;
  }
}
