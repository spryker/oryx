import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { marked } from 'marked';

export interface ContentField {
  type: string;
  key: string;
  value: string;
}

export const ContentfulFieldNormalizer = 'oryx.ContentfulFieldNormalizer*';

export function contentfulFieldNormalizer(data: ContentField): ContentField {
  if (data.type === 'Text') {
    return {
      ...data,
      value: marked.parse(data.value),
    };
  }

  return data;
}

export const contentfulFieldNormalizers: Provider[] = [
  {
    provide: ContentfulFieldNormalizer,
    useValue: contentfulFieldNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ContentfulFieldNormalizer]: Transformer<ContentField>;
  }
}
