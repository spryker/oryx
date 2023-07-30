import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { FooterTemplate } from './footer';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData({
      type: 'oryx-content-text',
      content: { data: { text: '<h1>test 123</h1>' } },
      merge: {
        selector: '#footer.corporate-promises.oryx-content-text',
        type: 'before',
      },
    }),
    provideExperienceData([
      // HeaderTemplate,
      FooterTemplate,
      // cartPage,
      // categoryPage,
      // checkoutPage,
      // contactPage,
      // homePage,
      // loginPage,
      // orderConfirmationPage,
      // productPage,
      // searchPage,
      // addressBookPage,
      // createAddressPage,
      // editAddressPage,
    ]),
  ],
};
