import { PickerFragment } from '../support/page_fragments/picker.fragment';
import { ProductFragment } from '../support/page_fragments/product.fragment';
import { PickerPage } from '../support/page_objects/picker.page';

describe('Fully pick a picking list', () => {
  const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';

  const pickerPage = new PickerPage(pickingListId);

  const pickerFragment = new PickerFragment();
  const productFragment = new ProductFragment();

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    pickerPage.visit();
    pickerPage.productFragment.getProducts().should('be.visible');

    pickerFragment.getProducts().each((product) => {
      cy.wrap(product).within(() => {
        productFragment.pickAllProductItems();
        productFragment.getSubmitButton().click();
      });
    });
  });

  it('must have all products on picked tab after done all of them', () => {
    pickerFragment.getProducts().then((products) => {
      pickerFragment
        .getTabCounter(pickerPage.getPickedTab())
        .should('contain.text', products.length);
    });

    pickerFragment.getPickingCompleteImage().should('be.visible');
    pickerFragment.getFinishPickingButton().should('be.visible');

    pickerFragment.getFinishPickingButton().eq(0).click();
    cy.location('pathname').should('be.eq', `/`);
  });
});
