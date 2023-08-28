import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { accountMenu } from './account-menu';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';
import {
  addressBookPage,
  cartPage,
  categoryPage,
  checkoutPage,
  contactPage,
  createAddressPage,
  defaultAccountPage,
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
      HeaderTemplate,
      FooterTemplate,
      accountMenu,
      overviewPage,
      defaultAccountPage,
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
