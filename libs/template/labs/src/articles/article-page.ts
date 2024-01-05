import { ExperienceComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';
import { articleTypes } from './article-types';

export const experienceArticlePages = [
  {
    merge: {
      selector: 'legal-links',
      type: 'patch',
    },
    type: 'oryx-composition',
    components: [
      {
        type: 'oryx-content-text',
        content: { data: { text: `©️ ${new Date().getFullYear()} Spryker` } },
      },
      {
        type: 'oryx-content-list',
        options: {
          tags: 'legal',
          rules: [
            {
              layout: {
                type: 'flex',
                divider: true,
              },
              width: 'auto',
            },
          ],
        },
      },
    ],
  },
  ...articleTypes
    .map(
      (type) =>
        [
          {
            type: 'Page',
            id: `${type}-list`,
            meta: {
              title: `${type} List`,
              route: `/${type}/:id`,
              routeType: type,
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
                      [type]: { max: 8 },
                    },
                  },
                  {
                    type: 'oryx-content-list',
                    options: {
                      rules: [{ layout: { type: 'list' } }],
                    },
                  },
                ],
              },
              { ref: 'footer' },
            ],
          },
          {
            type: 'Page',
            id: type,
            meta: {
              title: type,
              route: `/${type}/:id`,
              routeType: 'content',
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
                    type: 'oryx-data-text',
                    options: {
                      field: 'content',
                    },
                  },
                ],
              },
              { ref: 'footer' },
            ],
          },
        ] as ExperienceComponent[]
    )
    .flat(),
];
