import { CustomerNoteFragment } from '../support/page_fragments/customer-note.fragment';
import { PickingListsFragment } from '../support/page_fragments/picking-lists.fragment';
import { PickingProductFragment } from '../support/page_fragments/picking-product.fragment';
import { PickingFragment } from '../support/page_fragments/picking.fragment';

const pickingListsFragment = new PickingListsFragment();
const customerNoteFragment = new CustomerNoteFragment();
const pickingProductFragment = new PickingProductFragment();
const pickingFragment = new PickingFragment();

const insideTab = (alias, callback) => {
  cy.get(alias).then((tabId) => {
    pickingFragment.getTab(tabId).click();

    pickingFragment.getTabContent(tabId).within(() => {
      callback(tabId);
    });
  });
};

const checkTabProductsCount = (tabAlias: string, count: number) => {
  insideTab(tabAlias, () => {
    if (count === 0) {
      pickingProductFragment.getWrapper().should('not.exist');
    } else {
      pickingProductFragment.getWrapper().then((products) => {
        cy.wrap(products).should('have.length', count);
      });
    }
  });
};

it('should check partial picking', () => {
  cy.clearIndexedDB();
  cy.login();

  pickingListsFragment.getIdentifier();

  pickingListsFragment
    .getCustomerNoteButton()
    .parents('oryx-picking-list-item')
    .within(() => pickingListsFragment.getStartPickingButton().click());

  customerNoteFragment.getProceedToPickingButton().should('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(300);
  customerNoteFragment.getProceedToPickingButton().click();

  // Select the full quantity for all but one item
  pickingFragment
    .getTabsList()
    .eq(0)
    .invoke('attr', 'for')
    .as('notPickedTabId');

  pickingFragment.getTabsList().eq(1).invoke('attr', 'for').as('pickedTabId');

  pickingFragment.getTabsList().eq(2).invoke('attr', 'for').as('notFoundTabId');

  // Setting initial number of products in each tab
  insideTab('@notPickedTabId', () => {
    pickingProductFragment.getWrapper().then((products) => {
      cy.wrap(products.length).as('initialNotPickedListItemsNumber');
    });
  });
  insideTab('@pickedTabId', () => {
    pickingProductFragment.getWrapper().should('not.exist');
    cy.wrap(0).as('initialPickedListItemsNumber');
  });
  insideTab('@notFoundTabId', () => {
    pickingProductFragment.getWrapper().should('not.exist');
    cy.wrap(0).as('initialNotFoundListItemsNumber');
  });

  // Setting initial counters values
  pickingFragment
    .getTabCounter(pickingFragment.getTabsList().eq(0))
    .invoke('text')
    .then((count) => {
      cy.wrap(count).as('initialNotPickedCounterNumber');
    });
  pickingFragment
    .getTabCounter(pickingFragment.getTabsList().eq(1))
    .invoke('text')
    .then((count) => {
      cy.wrap(count).as('initialPickedCounterNumber');
    });
  pickingFragment
    .getTabCounter(pickingFragment.getTabsList().eq(2))
    .invoke('text')
    .then((count) => {
      cy.wrap(count).as('initialNotFoundCounterNumber');
    });

  // Pick all items of first product
  insideTab('@notPickedTabId', () => {
    pickingProductFragment
      .getWrapper()
      .eq(0)
      .within(() => {
        pickingProductFragment.pickAllProductItems();
        pickingProductFragment.getSubmitButton().click();
      });
  });

  // Not Picked tab list should have x-1 products
  cy.get('@initialNotPickedListItemsNumber').then((initCount) => {
    checkTabProductsCount('@notPickedTabId', Number(initCount) - 1);
  });
  // Not Picked tab counter should have x-1 number
  cy.get('@initialNotPickedCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(0))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount) - 1);
      });
  });

  // Picked tab list should have x+1 products
  cy.get('@initialPickedListItemsNumber').then((initCount) => {
    checkTabProductsCount('@pickedTabId', Number(initCount) + 1);
  });
  // Picked tab counter should have x+1 number
  cy.get('@initialPickedCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(1))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount) + 1);
      });
  });

  // Not Found tab list should have the same number of products
  cy.get('@initialNotFoundListItemsNumber').then((initCount) => {
    checkTabProductsCount('@notFoundTabId', Number(initCount));
  });
  // Not Found tab counter should stay the same number
  cy.get('@initialNotFoundCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(2))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount));
      });
  });

  // For the last item, select only part of the quantity.
  insideTab('@notPickedTabId', () => {
    pickingProductFragment
      .getWrapper()
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
    checkTabProductsCount('@notPickedTabId', Number(initCount) - 1);
  });
  // Not Picked tab counter should have the same number of products
  cy.get('@initialNotPickedCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(0))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount) - 1);
      });
  });

  // Open modal again
  insideTab('@notPickedTabId', () => {
    pickingProductFragment
      .getWrapper()
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
    checkTabProductsCount('@notPickedTabId', Number(initCount) - 2);
  });
  // Not Picked tab counter should have x-2 number
  cy.get('@initialNotPickedCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(0))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount) - 2);
      });
  });

  // Picked tab list should have x+2 products
  cy.get('@initialPickedListItemsNumber').then((initCount) => {
    checkTabProductsCount('@pickedTabId', Number(initCount) + 2);
  });
  // Picked tab counter should have x+1 number
  cy.get('@initialPickedCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(1))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount) + 2);
      });
  });

  // Not Found tab list should have x+1 products
  cy.get('@initialNotFoundListItemsNumber').then((initCount) => {
    checkTabProductsCount('@notFoundTabId', Number(initCount) + 1);
  });
  // Not Found tab counter should have x+1 products
  cy.get('@initialNotFoundCounterNumber').then((initCount) => {
    pickingFragment
      .getTabCounter(pickingFragment.getTabsList().eq(2))
      .invoke('text')
      .then((count) => {
        cy.wrap(Number(count)).should('be.eq', Number(initCount) + 1);
      });
  });

  // Verify that the “Great job” text and illustration are shown
  insideTab('@notPickedTabId', () => {
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
  const aliases = ['@notPickedTabId', '@pickedTabId', '@notFoundTabId'];
  aliases.forEach((alias) => {
    insideTab(alias, () => {
      pickingFragment.getFinishPickingButton().should('be.visible');
    });
  });

  // Tap the “Finish picking” button
  insideTab('@notFoundTabId', () => {
    pickingFragment.getFinishPickingButton().click();
  });

  // Verify that the Picking lists page is shown
  cy.location('pathname').should('be.eq', `/`);
  pickingListsFragment.getWrapper().should('be.visible');
});
