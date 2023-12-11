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
              layout: { type: 'list' },
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
          {
            type: 'oryx-composition',
            components: [{ ref: 'accountNavigation' }, component],
            options: {
              rules: [
                {
                  layout: {
                    type: 'split',
                    columnWidthType: 'aside',
                    divider: true,
                  },
                },
              ],
            },
          },
        ],
      },
      { ref: 'footer' },
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
