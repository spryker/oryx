import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
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
} from '../../1_0';
import { FooterTemplate } from '../../1_0/experience/footer';
import { HeaderTemplate } from '../../1_0/experience/header';
import { accountMenu } from './account-menu';
import { defaultAccountPage, overviewPage } from './pages';

export const staticExperienceLatestFeature: AppFeature = {
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
      defaultAccountPage,
      productPage,
      searchPage,
      addressBookPage,
      createAddressPage,
      editAddressPage,
      overviewPage,
    ]),
  ],
};
