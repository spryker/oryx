import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { marked } from 'marked';

export interface ContentfulContentField {
  type: string;
  key: string;
  value: unknown;
}

export const ContentfulFieldNormalizer = 'oryx.ContentfulFieldNormalizer*';

export function contentfulFieldNormalizer(
  data: ContentfulContentField
): ContentfulContentField {
  if (data.type === 'Text') {
    return {
      ...data,
      value: marked.parse(data.value as string, {
        mangle: false,
        headerIds: false,
      }),
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
    [ContentfulFieldNormalizer]: Transformer<ContentfulContentField>;
  }
}
