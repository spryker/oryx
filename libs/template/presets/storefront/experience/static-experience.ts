import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';

import {
  addressBookPage,
  cartPage,
  categoryPage,
  checkoutPage,
  contactPage,
  createAddressPage,
  editAddressPage,
  homePage,
  loginPage,
  orderPage,
  productPage,
  searchPage,
} from './pages';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      {
        components: [
          {
            type: 'oryx-composition',
            name: 'Composition',
            components: [
              {
                type: 'oryx-content-image',
                content: {
                  data: {
                    graphic: 'logo',
                    link: '/',
                    label: 'Composable Storefront based on Oryx',
                  },
                },
                options: {
                  rules: [
                    {
                      colSpan: 3,
                      height: '42px',
                      justify: 'start',
                      style: 'color: var(--oryx-color-primary-0, white)',
                    },
                    { query: { breakpoint: 'md' }, colSpan: 2 },
                  ],
                  link: '/',
                },
              },
              {
                type: 'oryx-search-box',
                options: {
                  rules: [
                    { colSpan: 6, width: 'auto' },
                    { query: { breakpoint: 'md' }, colSpan: 4 },
                  ],
                },
              },
            ],
            options: {
              rules: [
                {
                  layout: 'column',
                  background: 'var(--oryx-color-primary-9)',
                  align: 'center',
                  zIndex: '1',
                  padding: '5px 0',
                  gap: '5px',
                  sticky: true,
                  bleed: true,
                },
              ],
            },
          },
        ],
        strategy: {
          id: 'footer',
          before: 'oryx-composition*2.oryx-composition[2].oryx-content-link[2]',
        },
      },
    ]),
    provideExperienceData([
      HeaderTemplate,
      FooterTemplate,
      cartPage,
      categoryPage,
      checkoutPage,
      contactPage,
      homePage,
      loginPage,
      orderPage,
      productPage,
      searchPage,
      addressBookPage,
      createAddressPage,
      editAddressPage,
    ]),
  ],
};
