import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { homePage } from './pages';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      // HeaderTemplate,
      // FooterTemplate,
      // cartPage,
      // categoryPage,
      // checkoutPage,
      // contactPage,
      homePage,
      // loginPage,
      // orderConfirmationPage,
      // productPage,
      // searchPage,
      // addressBookPage,
      // createAddressPage,
      // editAddressPage,
      // merchantPage,
      // ...(featureVersion >= '1.1' ? [registrationPage] : []),
      // ...(featureVersion >= '1.4' ? [cartsPage, cartCreatePage] : []),
    ]),
  ],
};
