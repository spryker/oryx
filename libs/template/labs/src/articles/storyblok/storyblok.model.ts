export const StoryblokToken = 'oryx.StoryblokToken';
export const StoryblokSpace = 'oryx.StoryblokSpace';

export const enum StoryblokContentFields {
  Faq = 'faq',
}

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
