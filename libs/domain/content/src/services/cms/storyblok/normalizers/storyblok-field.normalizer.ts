import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { marked } from 'marked';

export interface StoryblokContentField {
  type: string;
  key: string;
  value: unknown;
}

export const StoryblokFieldNormalizer = 'oryx.StoryblokFieldNormalizer*';

export function storyblokFieldNormalizer(
  data: StoryblokContentField
): StoryblokContentField {
  if (data.type === 'markdown') {
    return {
      ...data,
      value: marked.parse(data.value as string),
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
    [StoryblokFieldNormalizer]: Transformer<StoryblokContentField>;
  }
}
