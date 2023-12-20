import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';
import {
  addressBookPage,
  cartPage,
  cartsPage,
  categoryPage,
  checkoutPage,
  contactPage,
  createAddressPage,
  editAddressPage,
  homePage,
  loginPage,
  merchantPage,
  orderConfirmationPage,
  productPage,
  registrationPage,
  searchPage,
} from './pages';

export const StaticExperienceFeature: AppFeature = {
  providers: [
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
      merchantPage,
      ...(featureVersion >= '1.1' ? [registrationPage] : []),
      ...(featureVersion >= '1.4' ? [cartsPage] : []),
    ]),
  ],
};
