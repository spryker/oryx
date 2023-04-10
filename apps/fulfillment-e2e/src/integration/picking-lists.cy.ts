import {PickingListsFragment} from "../support/page_fragments/picking-lists.fragment";

const pickingListsFragment = new PickingListsFragment()

describe('Picking Lists', () => {

  beforeEach(() => {
    cy.visit('/')
  });

  it('should display picking lists', () => {
    pickingListsFragment.getWrapper().should('be.visible')
    pickingListsFragment.getPickingListsItem().should('be.visible')
  });
})
