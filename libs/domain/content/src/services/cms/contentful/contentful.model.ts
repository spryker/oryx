import { ContentAdapter } from '../../adapter';

export const ContentfulToken = 'oryx.ContentfulToken';
export const ContentfulSpace = 'oryx.ContentfulSpace';
export const ContentfulContentAdapter = `${ContentAdapter}contentful`;

declare global {
  interface Environment {
    readonly ORYX_CONTENTFUL_TOKEN?: string;
    readonly ORYX_CONTENTFUL_SPACE?: string;
  }

  interface InjectionTokensContractMap {
    [ContentfulToken]: string;
    [ContentfulSpace]: string;
  }
}
