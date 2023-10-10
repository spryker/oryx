import { ContentAdapter } from '@spryker-oryx/content';

export const StoryblokToken = 'oryx.StoryblokToken';
export const StoryblokSpace = 'oryx.StoryblokSpace';
export const StoryblokContentAdapter = `${ContentAdapter}storyblok`;

declare global {
  interface Environment {
    readonly ORYX_STORYBLOK_TOKEN?: string;
    readonly ORYX_STORYBLOK_SPACE?: string;
  }

  interface InjectionTokensContractMap {
    [StoryblokToken]: string;
    [StoryblokSpace]: string;
  }
}
