import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { PickingHeaderFragment } from '../support/page_fragments/picking-header.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { PickingProductFragment } from '../support/page_fragments/picking-product.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';
import { PickingPage } from '../support/page_objects/picking.page';

const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';

const pickingPage = new PickingPage(pickingListId);

const pickingListsFragment = new PickingListsFragment();
const pickingProductFragment = new PickingProductFragment();
const pickingFragment = new PickingFragment();
const pickingHeaderFragment = new PickingHeaderFragment();
const customerNoteModalFragment = new CustomerNoteModalFragment();
const userProfileFragment = new UserProfileFragment();

describe('Partial picking a picklist', { tags: 'smoke' }, () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    pickingPage.visit();
    pickingPage.pickingProductFragment.getProducts().should('be.visible');
  });

  it('should check partial picking', () => {
    // See picking lists id
    pickingHeaderFragment
      .getPickingListsTitle()
      .should('be.visible')
      .and('contain', 'DE--19');

    // See customer note
    pickingHeaderFragment.getCustomerNoteIcon().should('be.visible').click();
    customerNoteModalFragment.getModal().should('be.visible');
    customerNoteModalFragment.getCloseButton().click();

    // See user profile modal
    pickingHeaderFragment.getUserIcon().should('be.visible').click();
    userProfileFragment.getWrapper().should('be.visible');
    userProfileFragment.getCloseButton().should('be.visible').click();
    userProfileFragment.getWrapper().should('not.be.visible');

    // Setting initial number of products in each tab
    pickingPage
      .getNotPickedProductsNumber()
      .as('initialNotPickedProductsNumber');
    pickingPage.getPickedProductsNumber().as('initialPickedProductsNumber');
    pickingPage.getNotFoundProductsNumber().as('initialNotFoundProductsNumber');

    // Check fallbacks on "Picked" and "Not Found" tabs
    pickingPage.insideTabContent(pickingPage.getPickedTab(), () => {
      pickingFragment.getNoItemsTitle().should('be.visible');
      pickingFragment.getNoItemsImage().should('be.visible');
    });

    pickingPage.insideTabContent(pickingPage.getNotFoundTab(), () => {
      pickingFragment.getNoItemsTitle().should('be.visible');
      pickingFragment.getNoItemsImage().should('be.visible');
    });

    // For the first item, select only part of the quantity.
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
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
      pickingPage
        .getNotPickedProductsNumber()
        .should('be.eq', Number(initCount) - 1);
    });

    // Picked tab list should have x+1 products
    cy.get('@initialPickedProductsNumber').then((initCount) => {
      pickingPage
        .getPickedProductsNumber()
        .should('be.eq', Number(initCount) + 1);
    });

    // Not Found tab list should have x+1 products
    cy.get('@initialNotFoundProductsNumber').then((initCount) => {
      pickingPage
        .getNotFoundProductsNumber()
        .should('be.eq', Number(initCount) + 1);
    });

    // Pick the rest of the products
    pickingPage.insideTabContent(pickingPage.getNotPickedTab(), () => {
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
