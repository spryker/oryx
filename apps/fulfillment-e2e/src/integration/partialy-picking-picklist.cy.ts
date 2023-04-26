import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { PickingProductFragment } from '../support/page_fragments/picking-product.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';
import { PickingPage } from '../support/page_objects/picking.page';

const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';

const pickingPage = new PickingPage(pickingListId);

const pickingListsFragment = new PickingListsFragment();
const pickingProductFragment = new PickingProductFragment();
const pickingFragment = new PickingFragment();

describe('Partial picking a picklist', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    pickingPage.visit();
  });

  it('should check partial picking', () => {
    // Setting initial number of products in each tab
    pickingPage.notPickedProductsNumber.as('initialNotPickedProductsNumber');
    pickingPage.pickedProductsNumber.as('initialPickedProductsNumber');
    pickingPage.notFoundProductsNumber.as('initialNotFoundProductsNumber');

    // For the first item, select only part of the quantity.
    pickingPage.insideTabContent(pickingPage.notPickedTab, () => {
      pickingPage.pickProduct(pickingProductFragment.getProducts().eq(0), 1);
    });

    // Verify that the Partial Picking Modal is opened.
    pickingFragment.getPartialPickingDialog().should('be.visible');

    // Confirm partial picking
    pickingFragment.getPartialPickingConfirmButton().click();

    // Dialog should be closed
    pickingFragment.getPartialPickingDialog().should('not.be.visible');

    // Verify that the picking item is moved to the "Picked" tab with the entered quantity, and the "Not found" tab with the not entered quantity.
    // Not Picked tab list should have x-1 products
    cy.get('@initialNotPickedProductsNumber').then((initCount) => {
      pickingPage.notPickedProductsNumber.should(
        'be.eq',
        Number(initCount) - 1
      );
    });

    // Picked tab list should have x+1 products
    cy.get('@initialPickedProductsNumber').then((initCount) => {
      pickingPage.pickedProductsNumber.should('be.eq', Number(initCount) + 1);
    });

    // Not Found tab list should have x+1 products
    cy.get('@initialNotFoundProductsNumber').then((initCount) => {
      pickingPage.notFoundProductsNumber.should('be.eq', Number(initCount) + 1);
    });

    // Pick the rest of the products
    pickingPage.insideTabContent(pickingPage.notPickedTab, () => {
      pickingProductFragment.getProducts().each((product) => {
        cy.wrap(product).within(() => {
          pickingProductFragment.pickAllProductItems();
          pickingProductFragment.getSubmitButton().click();
        });
      });

      // Verify that the congratulation text and illustration are shown
      pickingFragment.getPickingCompleteImage().should('be.visible');
      pickingFragment.getPickingCompleteTitle().should('be.visible');
      pickingFragment.getPickingCompleteText().should('be.visible');
    });

    // Verify that the “Finish picking” button appears
    const tabs = [
      pickingPage.notPickedTab,
      pickingPage.pickedTab,
      pickingPage.notFoundTab,
    ];

    tabs.forEach((tab) => {
      pickingPage.insideTabContent(tab, () => {
        pickingFragment.getFinishPickingButton().should('be.visible');
      });
    });

    // Tap the “Finish picking” button
    pickingPage.insideTabContent(pickingPage.notPickedTab, () => {
      pickingFragment.getFinishPickingButton().click();
    });

    // Verify that the Picking lists page is shown
    cy.location('pathname').should('be.eq', `/`);
    pickingListsFragment.getWrapper().should('be.visible');
  });
});
