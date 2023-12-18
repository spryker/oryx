import { ExperienceComponent } from '@spryker-oryx/experience';
import { SuggestionField } from '@spryker-oryx/search';

const experienceArticleTags = ['article', 'faq', 'about'];

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
        content: { data: { text: `©️ 2023 Spryker` } },
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
  ...experienceArticleTags
    .map(
      (tag) =>
        [
          {
            type: 'Page',
            id: `${tag}-list`,
            meta: {
              title: `${tag} List`,
              route: `/${tag}/:id`,
              routeType: tag,
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
                  { type: 'oryx-content-article' },
                ],
              },
              { ref: 'footer' },
            ],
          },
        ] as ExperienceComponent[]
    )
    .flat(),
];
