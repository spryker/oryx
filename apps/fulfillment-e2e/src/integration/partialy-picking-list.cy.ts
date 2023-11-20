import { CustomerNoteModalFragment } from '../support/page_fragments/customer-note-modal.fragment';
import { ListsFragment } from '../support/page_fragments/lists.fragment';
import { PickerHeaderFragment } from '../support/page_fragments/picker-header.fragment';
import { PickerFragment } from '../support/page_fragments/picker.fragment';
import { ProductFragment } from '../support/page_fragments/product.fragment';
import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';
import { PickerPage } from '../support/page_objects/picker.page';

// TODO: ???? hardcoded data
const pickingListId = '37cb241e-f18a-5768-985c-a2d7aff4875e';
const pickerPage = new PickerPage(pickingListId);

const listsFragment = new ListsFragment();
const productFragment = new ProductFragment();
const pickerFragment = new PickerFragment();
const pickerHeaderFragment = new PickerHeaderFragment();
const customerNoteModalFragment = new CustomerNoteModalFragment();
const userProfileFragment = new UserProfileFragment();

// TODO: this suite is a complete 150-line mess
describe('Partial picking a picklist', () => {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.login();
    pickerPage.visit();
    pickerPage.productFragment.getProducts().should('be.visible');
  });

  it('should check partial picking', () => {
    // See picking lists id
    // TODO: ???? hardcoded data
    pickerHeaderFragment
      .getPickingListsTitle()
      .should('be.visible')
      .and('contain', 'DE--19');

    // See customer note
    pickerHeaderFragment.getCustomerNoteIcon().should('be.visible').click();
    customerNoteModalFragment.getModal().should('be.visible');
    customerNoteModalFragment.getCloseButton().click();

    // See user profile modal
    pickerHeaderFragment.getUserIcon().should('be.visible').click();
    userProfileFragment.getWrapper().should('be.visible');
    userProfileFragment.getCloseButton().should('be.visible').click();
    userProfileFragment.getWrapper().should('not.be.visible');

    // Setting initial number of products in each tab
    pickerPage
      .getNotPickedProductsNumber()
      .as('initialNotPickedProductsNumber');
    pickerPage.getPickedProductsNumber().as('initialPickedProductsNumber');
    pickerPage.getNotFoundProductsNumber().as('initialNotFoundProductsNumber');

    // Check fallbacks on "Picked" and "Not Found" tabs
    pickerPage.insideTabContent(pickerPage.getPickedTab(), () => {
      pickerFragment.getNoItemsTitle().should('be.visible');
      pickerFragment.getNoItemsImage().should('be.visible');
    });

    pickerPage.insideTabContent(pickerPage.getNotFoundTab(), () => {
      pickerFragment.getNoItemsTitle().should('be.visible');
      pickerFragment.getNoItemsImage().should('be.visible');
    });

    // For the first item, select only part of the quantity.
    pickerPage.insideTabContent(pickerPage.getNotPickedTab(), () => {
      pickerPage.pickProduct(productFragment.getProducts().eq(0), 1);
    });

    // Verify that the Partial Picking Modal is opened.
    pickerFragment.getPartialPickingDialog().should('be.visible');

    // Confirm partial picking
    pickerFragment.getPartialPickingConfirmButton().click();

    // Dialog should be closed
    pickerFragment.getPartialPickingDialog().should('not.be.visible');

    // Verify that the picking item is moved to the "Picked" tab with the entered quantity, and the "Not found" tab with the not entered quantity.
    // Not Picked tab list should have x-1 products
    cy.get('@initialNotPickedProductsNumber').then((initCount) => {
      pickerPage
        .getNotPickedProductsNumber()
        .should('be.eq', Number(initCount) - 1);
    });

    // Picked tab list should have x+1 products
    cy.get('@initialPickedProductsNumber').then((initCount) => {
      pickerPage
        .getPickedProductsNumber()
        .should('be.eq', Number(initCount) + 1);
    });

    // Not Found tab list should have x+1 products
    cy.get('@initialNotFoundProductsNumber').then((initCount) => {
      pickerPage
        .getNotFoundProductsNumber()
        .should('be.eq', Number(initCount) + 1);
    });

    // Pick the rest of the products
    pickerPage.insideTabContent(pickerPage.getNotPickedTab(), () => {
      productFragment.getProducts().each((product) => {
        cy.wrap(product).within(() => {
          productFragment.pickAllProductItems();
          productFragment.getSubmitButton().click();
        });
      });

      // Verify that the congratulation text and illustration are shown
      pickerFragment.getPickingCompleteImage().should('be.visible');
      pickerFragment.getPickingCompleteTitle().should('be.visible');
      pickerFragment.getPickingCompleteText().should('be.visible');
    });

    // Verify that the “Finish picking” button appears
    const tabs = [
      pickerPage.getNotPickedTab(),
      pickerPage.getPickedTab(),
      pickerPage.getNotFoundTab(),
    ];

    tabs.forEach((tab) => {
      pickerPage.insideTabContent(tab, () => {
        pickerFragment.getFinishPickingButton().should('be.visible');
      });
    });

    // Tap the “Finish picking” button
    pickerPage.insideTabContent(pickerPage.getNotPickedTab(), () => {
      pickerFragment.getFinishPickingButton().click();
    });

    // Verify that the Picking lists page is shown
    cy.location('pathname').should('be.eq', `/`);
    listsFragment.getWrapper().should('be.visible');
  });
});
