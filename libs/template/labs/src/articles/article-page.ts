import { StaticComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';
import { StoryblokContentFields } from './storyblok';

export const articlesPage: StaticComponent = {
  type: 'Page',
  meta: { route: '/article' },
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
          [SuggestionField.Products]: undefined,
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

export const articlePage: StaticComponent = {
  type: 'Page',
  meta: { route: '/article/:id' },
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

export const faqsPage: StaticComponent = {
  type: 'Page',
  meta: { route: '/faq' },
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
          [SuggestionField.Articles]: undefined,
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

export const faqPage: StaticComponent = {
  type: 'Page',
  meta: { route: '/faq/:id' },
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
