import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { marked } from 'marked';
import { ContentField } from '../../contentful';

export const StoryblokFieldNormalizer = 'oryx.StoryblokFieldNormalizer*';

export function storyblokFieldNormalizer(data: ContentField): ContentField {
  if (data.type === 'markdown') {
    return {
      ...data,
      value: marked.parse(data.value),
    };
  }

  return data;
}

export const storyblokFieldNormalizers: Provider[] = [
  {
    provide: StoryblokFieldNormalizer,
    useValue: storyblokFieldNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [StoryblokFieldNormalizer]: Transformer<ContentField>;
  }
}
