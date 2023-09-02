import { ExperienceComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';
import { ContentfulContentFields } from './contentful';
import { StoryblokContentFields } from './storyblok';

export const articlesPage: ExperienceComponent = {
  type: 'Page',
  id: 'articles',
  meta: {
    title: 'Articles Page',
    route: `/${ContentfulContentFields.Article}`,
  },
  options: {
    rules: [{ layout: 'flex', padding: '30px 0' }],
  },
  components: [
    {
      type: 'oryx-search-box',
      options: {
        rules: [{ margin: 'auto', width: '580px' }],
        [SuggestionField.Suggestions]: null,
        [SuggestionField.Categories]: null,
        [SuggestionField.Contents]: null,
        [SuggestionField.Products]: null,
        [ContentfulContentFields.Article]: {
          max: 8,
        },
        type: ContentfulContentFields.Article,
      },
    },
    {
      type: 'oryx-content-articles',
      options: {
        rules: [{ width: '80%', margin: 'auto' }],
      },
    },
  ],
};

export const articlePage: ExperienceComponent = {
  type: 'Page',
  id: 'article',
  meta: {
    title: 'Article Page',
    route: `/${ContentfulContentFields.Article}/:id`,
  },
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
};

export const faqsPage: ExperienceComponent = {
  type: 'Page',
  id: 'faqs',
  meta: { title: 'FAQs Page', route: `/${StoryblokContentFields.Faq}` },
  options: {
    rules: [{ layout: 'flex', padding: '30px 0' }],
  },
  components: [
    {
      type: 'oryx-search-box',
      options: {
        rules: [{ margin: 'auto', width: '580px' }],
        [SuggestionField.Suggestions]: null,
        [SuggestionField.Categories]: null,
        [SuggestionField.Contents]: null,
        [SuggestionField.Products]: null,
        [StoryblokContentFields.Faq]: {
          max: 8,
        },
        type: StoryblokContentFields.Faq,
      },
    },
    {
      type: 'oryx-content-articles',
      options: {
        rules: [{ width: '80%', margin: 'auto' }],
      },
    },
  ],
};

export const faqPage: ExperienceComponent = {
  type: 'Page',
  id: 'faq',
  meta: { title: 'FAQ Page', route: `/${StoryblokContentFields.Faq}/:id` },
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
};
