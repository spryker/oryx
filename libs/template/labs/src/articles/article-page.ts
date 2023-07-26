import { ExperienceComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';
import { ContentfulContentFields } from './contentful';
import { StoryblokContentFields } from './storyblok';

export const articlesPage: ExperienceComponent = {
  type: 'Page',
  id: 'articles',
  meta: { route: `/${ContentfulContentFields.Article}` },
  options: {
    rules: [{ layout: 'flex', padding: '30px 0' }],
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'articlesBody',
      options: {
        rules: [{ layout: 'flex', padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-search-box',
          options: {
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
        {
          type: 'oryx-content-articles',
          options: {
            rules: [{ width: '80%', margin: 'auto' }],
          },
        },
      ],
    },
    { ref: 'footer' },
  ],
};

export const articlePage: ExperienceComponent = {
  type: 'Page',
  id: 'article',
  meta: { route: `/${ContentfulContentFields.Article}/:id` },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'articleBody',
      options: {
        rules: [{ layout: 'flex', padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-content-article',
          options: {
            rules: [{ width: '80%', margin: 'auto' }],
          },
        },
      ],
    },
    { ref: 'footer' },
  ],
};

export const faqsPage: ExperienceComponent = {
  type: 'Page',
  id: 'faqs',
  meta: { route: `/${StoryblokContentFields.Faq}` },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'faqsBody',
      options: {
        rules: [{ layout: 'flex', padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-search-box',
          options: {
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
        {
          type: 'oryx-content-articles',
          options: {
            rules: [{ width: '80%', margin: 'auto' }],
          },
        },
      ],
    },
    { ref: 'footer' },
  ],
};

export const faqPage: ExperienceComponent = {
  type: 'Page',
  id: 'faq',
  meta: { route: `/${StoryblokContentFields.Faq}/:id` },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      id: 'faqBody',
      options: {
        rules: [{ layout: 'flex', padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-content-article',
          options: {
            rules: [{ width: '80%', margin: 'auto' }],
          },
        },
      ],
    },
    { ref: 'footer' },
  ],
};
