import { PickingProductFragment } from '../support/page_fragments/picking-product.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';

describe('Fully pick a picking list', () => {
  const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';
  const pickingFragment = new PickingFragment();
  const pickingProductFragment = new PickingProductFragment();

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    cy.visit(`/picking-list/picking/${pickingListId}`);

    pickingFragment.getProducts().each((product) => {
      cy.wrap(product).within(() => {
        pickingProductFragment.pickAllProductItems();
        pickingProductFragment.getSubmitButton().click();
      });
    });
  });

  it('must have all products on picked tab after done all of them', () => {
    pickingFragment.getProducts().then((products) => {
      pickingFragment
        .getTabCounter(pickingFragment.getTabsList().eq(1))
        .should('contain.text', products.length);
    });

    pickingFragment.getPickingCompleteImage().should('be.visible');
    pickingFragment.getFinishPickingButton().should('be.visible');

    pickingFragment.getFinishPickingButton().eq(0).click();
    cy.location('pathname').should('be.eq', `/`);
  });
});
