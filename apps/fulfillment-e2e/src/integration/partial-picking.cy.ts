import { PickingListPage } from '../support/page_objects/picking-list.page';
import { PickingPage } from '../support/page_objects/picking.page';

let pickingListPage;

describe('Partial pick a picking list', () => {
  beforeEach(() => {
    pickingListPage = new PickingListPage();

    cy.clearIndexedDB();
    cy.login();
    cy.cleanupPickings();
    cy.createPicking(2).then((orderId) => {
      cy.receiveData();
      cy.waitForPickingToAppear(orderId);

      pickingListPage.startPickingByEq(0);
    });
  });

  it('must pick all products successfully', () => {
    const pickingPage = new PickingPage();

    pickingPage.pickAllProducts();
    pickingPage.finishPicking();

    cy.location('pathname').should('be.eq', `/`);
    pickingListPage.getPickingListItems().should('have.length', 0);
  });
});
