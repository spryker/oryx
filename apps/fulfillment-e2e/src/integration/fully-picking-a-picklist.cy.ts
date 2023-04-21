import { PickingFragment } from '../support/page_fragments/picking.fragment';

describe('Fully pick a picking list', () => {
  const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';
  const pickingFragment = new PickingFragment();

  beforeEach(() => {
    cy.visit(`/picking-list/picking/${pickingListId}`);
  });

  describe('Picking all product items', () => {
    beforeEach(() => {
      [pickingFragment.getProducts()].forEach((product) => {
        const oryxCartQuantity =
          pickingFragment.getProductQuantityInput(product);
        const increaseButton =
          pickingFragment.getQuantityIncreaseButton(oryxCartQuantity);

        increaseButton.click({ multiple: true });
      });

      [pickingFragment.getProducts()].forEach((product) => {
        pickingFragment
          .getProductDoneButton(product)
          .should('exist')
          .click({ multiple: true });
      });
    });

    it('must have all products on picked tab after done all of them', () => {
      pickingFragment.getProducts().then((products) => {
        pickingFragment
          .getTabCounter(pickingFragment.getTabsList().eq(1))
          .should('contain.text', products.length);
      });

      pickingFragment.getAllItemsDonePlaceholder().should('exist');
      pickingFragment.getFinishButton().should('exist');
    });

    it('must navigate to picking lists after finish picking', () => {
      pickingFragment.getFinishButton().eq(0).click();
      cy.location('pathname').should('be.eq', `/`);
    });
  });
});
