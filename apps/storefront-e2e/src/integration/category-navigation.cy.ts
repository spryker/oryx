import { CategoryNavigationFragment } from '../support/page-fragments/category-navigation.fragment';
import { LandingPage } from '../support/page-objects/landing.page';

describe('Category navigation suite', () => {
  let landingPage;

  describe('when the landing page is visited', () => {
    beforeEach(() => {
      landingPage = new LandingPage();
      landingPage.visit();
    });

    it('should have all products link in the category navigation bar', async () => {
      const navigation = new CategoryNavigationFragment();
      navigation.getLink(0).should('contain.text', 'All products');
      navigation
        .getLink(1)
        .invoke('attr', 'href')
        .should('contain', '/category/');
    });
  });
});
