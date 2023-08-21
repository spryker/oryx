import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { accountMenu } from './account-menu';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';
import {
  accountPage,
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
  overviewPage,
  productPage,
  searchPage,
} from './pages';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      accountMenu,
      HeaderTemplate,
      FooterTemplate,
      cartPage,
      categoryPage,
      checkoutPage,
      contactPage,
      homePage,
      loginPage,
      orderConfirmationPage,
      accountPage,
      productPage,
      searchPage,
      addressBookPage,
      createAddressPage,
      editAddressPage,
      overviewPage,
    ]),
  ],
};
