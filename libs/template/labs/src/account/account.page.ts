import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { pages } from './types';

const accountPage = (
  id: string,
  meta: { title: string; route: string },
  component: ExperienceComponent = {}
): ExperienceComponent => {
  return {
    id,
    type: 'Page',
    meta: {
      title: meta.title,
      route: meta.route,
      index: false,
    },
    components: [
      { ref: 'header' },
      {
        type: 'oryx-composition',
        options: {
          rules: [
            {
              layout: { type: 'split', columnWidthType: 'aside' },
              padding: '30px 0 0',
            },
          ],
        },
        components: [
          {
            type: 'oryx-site-breadcrumb',
            options: {
              rules: [
                {
                  colSpan: 2,
                },
                { query: { breakpoint: Size.Sm }, hide: true },
              ],
            },
          },
          { ref: 'accountNavigation' },
          component,
        ],
      },
    ],
  };
};

export const accountPages = pages.map((page) =>
  accountPage(
    page.type,
    { route: `/my-account/${page.type}`, title: page.type },
    page.component
  )
);
