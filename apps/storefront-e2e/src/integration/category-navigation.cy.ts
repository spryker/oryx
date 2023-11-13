import { CategoryNavigationFragment } from '../support/page-fragments/category-navigation.fragment';
import { LandingPage } from '../support/page-objects/landing.page';

describe('Category navigation suite', () => {
  let landingPage;

  describe('when the landing page is visited', () => {
    beforeEach(() => {
      landingPage = new LandingPage();
      landingPage.visit();
    });

    it('should render the category navigation in the header ', () => {
      const navigation = new CategoryNavigationFragment().get();
      navigation.should('be.visible');
    });

    it('should have all products link in the category navigation bar', () => {
      const link = new CategoryNavigationFragment().getLink(0);
      link.should('contain.text', 'All products');
    });

    describe('and a navigation item is clicked', () => {
      let url: string;

      beforeEach(() => {
        const link = new CategoryNavigationFragment().getLink(1);

        link.invoke('attr', 'href').then((href) => {
          url = href;
          cy.visit(url);
        });
      });

      it('should open the associated url', () => {
        cy.location('pathname').should('eq', url);
      });
    });
  });
});
