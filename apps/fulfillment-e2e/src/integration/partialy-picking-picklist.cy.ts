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
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
      pickingProductFragment.getProducts().then((products) => {
        cy.wrap(products.length).as('initialNotPickedListItemsNumber');
      });
    });
    pickingPage.insideTabContent(pickingPage.getPickedTab(), () => {
      pickingProductFragment.getProducts().should('not.exist');
      cy.wrap(0).as('initialPickedListItemsNumber');
    });
    pickingPage.insideTabContent(pickingPage.getNotFoundTab(), () => {
      pickingProductFragment.getProducts().should('not.exist');
      cy.wrap(0).as('initialNotFoundListItemsNumber');
    });

    // For the first item, select only part of the quantity.
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
      pickingProductFragment
        .getProducts()
        .eq(0)
        .within(() => {
          pickingProductFragment.getQuantityInputPlusButton().click();
          pickingProductFragment.getSubmitButton().click();
        });
    });

    // Verify that the Partial Picking Modal is opened.
    pickingFragment.getPartialPickingDialog().should('have.attr', 'open');

    // Close dialog
    pickingFragment.getPartialPickingCancelButton().click();

    // Dialog should be closed
    pickingFragment.getPartialPickingDialog().should('not.have.attr', 'open');

    // Not Picked tab list should have the same number of products
    cy.get('@initialNotPickedListItemsNumber').then((initCount) => {
      pickingPage.checkTabProductsCount(
        pickingPage.getNotPickedTab(),
        Number(initCount)
      );
    });

    // Open modal again
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
      pickingProductFragment
        .getProducts()
        .eq(0)
        .within(() => {
          pickingProductFragment.getSubmitButton().click();
        });
    });

    // Verify that the Partial Picking Modal is opened.
    pickingFragment.getPartialPickingDialog().should('have.attr', 'open');

    // Confirm partial picking
    pickingFragment.getPartialPickingConfirmButton().click();

    // Dialog should be closed
    pickingFragment.getPartialPickingDialog().should('not.have.attr', 'open');

    // Verify that the picking item is moved to the "Picked" tab with the entered quantity, and the "Not found" tab with the not entered quantity.
    // Not Picked tab list should have x-2 products
    cy.get('@initialNotPickedListItemsNumber').then((initCount) => {
      pickingPage.checkTabProductsCount(
        pickingPage.getNotPickedTab(),
        Number(initCount) - 1
      );
    });

    // Picked tab list should have x+2 products
    cy.get('@initialPickedListItemsNumber').then((initCount) => {
      pickingPage.checkTabProductsCount(
        pickingPage.getPickedTab(),
        Number(initCount) + 1
      );
    });

    // Not Found tab list should have x+1 products
    cy.get('@initialNotFoundListItemsNumber').then((initCount) => {
      pickingPage.checkTabProductsCount(
        pickingPage.getNotFoundTab(),
        Number(initCount) + 1
      );
    });

    //
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
      pickingProductFragment.getProducts().each((product) => {
        cy.wrap(product).within(() => {
          pickingProductFragment.pickAllProductItems();
          pickingProductFragment.getSubmitButton().click();
        });
      });

      // Verify that the “Great job” text and illustration are shown
      pickingFragment.getPickingCompleteImage().should('be.visible');
      pickingFragment.getPickingCompleteTitle().should('be.visible');
      pickingFragment
        .getPickingCompleteTitle()
        .invoke('text')
        .then((text) => {
          cy.wrap(text).should('be.eq', 'Great job!');
        });

      pickingFragment.getPickingCompleteText().should('be.visible');
      pickingFragment
        .getPickingCompleteText()
        .invoke('text')
        .then((text) => {
          cy.wrap(text).should('be.eq', 'All items are processed!');
        });
    });

    // Verify that the “Finish picking” button appears
    const tabs = [
      pickingPage.getNotPickedTab(),
      pickingPage.getPickedTab(),
      pickingPage.getNotFoundTab(),
    ];
    tabs.forEach((tab) => {
      pickingPage.insideTabContent(tab, () => {
        pickingFragment.getFinishPickingButton().should('be.visible');
      });
    });

    // Tap the “Finish picking” button
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
      pickingFragment.getFinishPickingButton().click();
    });

    // Verify that the Picking lists page is shown
    cy.location('pathname').should('be.eq', `/`);
    pickingListsFragment.getWrapper().should('be.visible');
  });
});
