export const ContentfulToken = 'oryx.ContentfulToken';
export const ContentfulSpace = 'oryx.ContentfulSpace';

export const enum ContentfulContentFields {
  Article = 'article',
  Component = 'component',
}

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
