import { ContentFields } from '@spryker-oryx/content';
import { ExperienceComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';

export const articlesPage: ExperienceComponent = {
  type: 'Page',
  id: 'articles',
  meta: {
    title: 'Articles',
    route: `/${ContentFields.Article}`,
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      options: {
        rules: [{ layout: { type: 'split' }, padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: { rules: [{ colSpan: 2 }] },
        },
        {
          type: 'oryx-search-box',
          options: {
            rules: [{ margin: 'auto', width: '580px' }],
            [SuggestionField.Suggestions]: null,
            [SuggestionField.Categories]: null,
            [SuggestionField.Contents]: null,
            [SuggestionField.Products]: null,
            [ContentFields.Article]: {
              max: 8,
            },
          },
        },
        {
          type: 'oryx-content-articles',
        },
      ],
    },
    { ref: 'footer' },
  ],
};

export const articlePage: ExperienceComponent = {
  type: 'Page',
  id: 'article',
  meta: {
    title: 'Article',
    route: `/${ContentFields.Article}/:id`,
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      options: {
        rules: [{ layout: { type: 'split' }, padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: { rules: [{ colSpan: 2 }] },
        },
        { type: 'oryx-content-article' },
      ],
    },
    { ref: 'footer' },
  ],
};

export const faqsPage: ExperienceComponent = {
  type: 'Page',
  id: 'faqs',
  meta: { title: 'FAQs', route: `/${ContentFields.Faq}` },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      options: {
        rules: [{ layout: { type: 'split' }, padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: { rules: [{ colSpan: 2 }] },
        },
        {
          type: 'oryx-search-box',
          options: {
            rules: [{ margin: 'auto', width: '580px' }],
            [SuggestionField.Suggestions]: null,
            [SuggestionField.Categories]: null,
            [SuggestionField.Contents]: null,
            [SuggestionField.Products]: null,
            [ContentFields.Article]: {
              max: 8,
            },
          },
        },
        {
          type: 'oryx-content-articles',
        },
      ],
    },
    { ref: 'footer' },
  ],
};

export const faqPage: ExperienceComponent = {
  type: 'Page',
  id: 'faq',
  meta: { title: 'FAQ', route: `/${ContentFields.Faq}/:id` },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-composition',
      options: {
        rules: [{ layout: { type: 'split' }, padding: '30px 0' }],
      },
      components: [
        {
          type: 'oryx-site-breadcrumb',
          options: { rules: [{ colSpan: 2 }] },
        },
        { type: 'oryx-content-article' },
      ],
    },
    { ref: 'footer' },
  ],
};
