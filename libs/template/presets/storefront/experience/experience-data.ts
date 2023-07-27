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
  orderConfirmationPage,
  productPage,
  searchPage,
} from './pages';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      {
        merge: {
          type: 'replace',
          selector:
            'footer.footerLinks.oryx-composition.topFooter.selfService.oryx-content-text',
        },
        type: 'oryx-content-text',
        content: {
          data: {
            text: 'I am after all occurrences of the oryx-product-title component',
          },
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
      orderConfirmationPage,
      productPage,
      searchPage,
      addressBookPage,
      createAddressPage,
      editAddressPage,
    ]),
  ],
};
