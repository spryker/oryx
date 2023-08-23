import { CmsQualifier } from './cms-qualifier';
import { CompositionProperties } from './composition.model';

export const ContentfulToken = 'oryx.ContentfulToken';
export const ContentfulSpace = 'oryx.ContentfulSpace';

declare global {
  interface Environment {
    readonly ORYX_CONTENTFUL_TOKEN?: string;
    readonly ORYX_CONTENTFUL_SPACE?: string;
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
  internalId: string;
};

export interface CmsModel<T = CmsEntry> {
  qualifier: CmsQualifier;
  items: (T & CmsEntry)[];
}

declare global {
  interface InjectionTokensContractMap {
    [ContentfulToken]: string;
    [ContentfulSpace]: string;
  }
}
