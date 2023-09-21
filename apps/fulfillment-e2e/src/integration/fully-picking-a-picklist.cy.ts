import { PickingProductFragment } from '../support/page_fragments/picking-product.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';
import { PickingPage } from '../support/page_objects/picking.page';

describe('Fully pick a picking list', { tags: 'smoke' }, () => {
  const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';

  const pickingPage = new PickingPage(pickingListId);

  const pickingFragment = new PickingFragment();
  const pickingProductFragment = new PickingProductFragment();

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    pickingPage.visit();
    pickingPage.pickingProductFragment.getProducts().should('be.visible');

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
        .getTabCounter(pickingPage.getPickedTab())
        .should('contain.text', products.length);
    });

    pickingFragment.getPickingCompleteImage().should('be.visible');
    pickingFragment.getFinishPickingButton().should('be.visible');

    pickingFragment.getFinishPickingButton().eq(0).click();
    cy.location('pathname').should('be.eq', `/`);
  });
});
