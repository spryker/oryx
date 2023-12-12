import { SuggestionField } from '@spryker-oryx/search';

const experienceArticleTags = ['article', 'faq', 'about'];

export const experienceArticlePages = experienceArticleTags
  .map((tag) => [
    {
      type: 'Page',
      id: `${tag}-list`,
      meta: {
        title: `${tag} List`,
        route: `/${tag}`,
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
                [tag]: { max: 8 },
              },
            },
            { type: 'oryx-content-articles' },
          ],
        },
        { ref: 'footer' },
      ],
    },
    {
      type: 'Page',
      id: tag,
      meta: {
        title: tag,
        route: `/${tag}/:id`,
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
              type: 'oryx-entity-text',
              options: {
                entity: 'content',
                field: 'fields.content',
              },
            },
            {
              type: 'oryx-entity-image',
              options: {
                entity: 'content',
                field: 'fields.image',
              },
            },

            { type: 'oryx-content-article' },
          ],
        },
        { ref: 'footer' },
      ],
    },
  ])
  .flat();
