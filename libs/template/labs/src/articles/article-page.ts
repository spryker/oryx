import { ExperienceComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';
import { ContentfulContentFields } from './contentful';
import { StoryblokContentFields } from './storyblok';

export const articlesPage: ExperienceComponent = {
  type: 'Page',
  meta: { route: `/${ContentfulContentFields.Article}` },
  options: {
    data: {
      rules: [{ layout: 'flex', padding: '30px 0' }],
    },
  },
  components: [
    {
      type: 'oryx-search-box',
      options: {
        data: {
          rules: [{ margin: 'auto', width: '580px' }],
          [SuggestionField.Suggestions]: undefined,
          [SuggestionField.Categories]: undefined,
          [SuggestionField.Contents]: undefined,
          [SuggestionField.Products]: undefined,
          [ContentfulContentFields.Article]: {
            max: 8,
          },
        },
      },
    },
    {
      type: 'oryx-content-articles',
      options: {
        data: {
          rules: [{ width: '80%', margin: 'auto' }],
        },
      },
    },
  ],
};

export const articlePage: ExperienceComponent = {
  type: 'Page',
  meta: { route: `/${ContentfulContentFields.Article}/:id` },
  options: {
    data: {
      rules: [{ layout: 'flex', padding: '30px 0' }],
    },
  },
  components: [
    {
      type: 'oryx-content-article',
      options: {
        data: {
          rules: [{ width: '80%', margin: 'auto' }],
        },
      },
    },
  ],
};

export const faqsPage: ExperienceComponent = {
  type: 'Page',
  meta: { route: `/${StoryblokContentFields.Faq}` },
  options: {
    data: {
      rules: [{ layout: 'flex', padding: '30px 0' }],
    },
  },
  components: [
    {
      type: 'oryx-search-box',
      options: {
        data: {
          rules: [{ margin: 'auto', width: '580px' }],
          [SuggestionField.Suggestions]: undefined,
          [SuggestionField.Categories]: undefined,
          [SuggestionField.Contents]: undefined,
          [SuggestionField.Products]: undefined,
          [StoryblokContentFields.Faq]: {
            max: 8,
          },
        },
      },
    },
    {
      type: 'oryx-content-articles',
      options: {
        data: {
          rules: [{ width: '80%', margin: 'auto' }],
        },
      },
    },
  ],
};

export const faqPage: ExperienceComponent = {
  type: 'Page',
  meta: { route: `/${StoryblokContentFields.Faq}/:id` },
  options: {
    data: {
      rules: [{ layout: 'flex', padding: '30px 0' }],
    },
  },
  components: [
    {
      type: 'oryx-content-article',
      options: {
        data: {
          rules: [{ width: '80%', margin: 'auto' }],
        },
      },
    },
  ],
};
