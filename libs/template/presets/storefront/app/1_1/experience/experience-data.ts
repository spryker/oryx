import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { FooterTemplate } from '../../1_0/experience/footer';
import { HeaderTemplate } from '../../1_0/experience/header';
import {
  addressBookPage,
  categoryPage,
  contactPage,
  createAddressPage,
  editAddressPage,
  homePage,
  loginPage,
  productPage,
  searchPage,
} from '../../1_0/experience/pages';
import { cartPage, checkoutPage, orderConfirmationPage } from './pages';

export const staticExperienceLatestFeature: AppFeature = {
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
    ]),
  ],
};
