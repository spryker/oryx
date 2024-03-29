// TODO: Turned off because there are errors in imports
// In any case - the whole file should be rewritten

// import { ListsHeaderFragment } from '../support/page_fragments/lists-header.fragment';
// import { ListsFragment } from '../support/page_fragments/lists.fragment';
// import { PickerHeaderFragment } from '../support/page_fragments/picker-header.fragment';
// import { UserProfileFragment } from '../support/page_fragments/user-profile-modal.fragment';
// import { LoginPage } from '../support/page_objects/login.page';

// const listsFragment = new ListsFragment();
// const userProfileFragment = new UserProfileFragment();
// const loginPage = new LoginPage();
// const pickerHeaderFragment = new PickerHeaderFragment();
// const listsHeaderFragment = new ListsHeaderFragment();

// // TODO: this is not E2E, these are component tests
// xdescribe('When a user opens the user profile modal', () => {
//   beforeEach(() => {
//     cy.clearIndexedDB();
//     cy.login();
//     listsHeaderFragment.getUserIcon().click();
//   });

//   it('should display modal', () => {
//     userProfileFragment.getWrapper().should('be.visible');
//     userProfileFragment.getLogOutButton().should('be.visible');
//     userProfileFragment.getNotification().should('not.exist');
//   });

//   describe('and sync is pending', () => {
//     beforeEach(() => {
//       cy.mockSyncPending();
//       cy.visit('/');

//       listsHeaderFragment.getUserIcon().click();
//     });

//     it('should show message and disable log out button', () => {
//       userProfileFragment.getLogOutButton().should('have.attr', 'disabled');
//       userProfileFragment.getNotification().should('be.visible');
//       userProfileFragment
//         .getNotification()
//         .should(
//           'contain.text',
//           `You can't log out because of a pending synchronization`
//         );
//     });
//   });

//   describe('and picking is in progress', () => {
//     beforeEach(() => {
//       cy.createPicking().then((orderId) => {
//         cy.visit('/');
//         cy.waitForPickingToAppear(orderId);
//       });

//       userProfileFragment.getCloseButton().click();
//       listsFragment.getStartPickingButtons().eq(0).click();

//       pickerHeaderFragment.getUserIcon().click();
//     });

//     it('should show message and disable log out button', () => {
//       userProfileFragment.getLogOutButton().should('have.attr', 'disabled');
//       userProfileFragment.getNotification().should('be.visible');
//       userProfileFragment
//         .getNotification()
//         .should(
//           'contain.text',
//           `You can't log out because picking is in progress`
//         );
//       userProfileFragment.getReceiveDataButton().should('not.exist');
//     });
//   });

//   describe.only('and sync is pending and picking is in progress', () => {
//     beforeEach(() => {
//       cy.createPicking().then((orderId) => {
//         cy.mockSyncPending();
//         cy.visit('/');
//         cy.waitForPickingToAppear(orderId);

//         listsFragment.getStartPickingButtons().eq(0).click();
//         pickerHeaderFragment.getUserIcon().click();
//       });
//     });

//     it('should show picking in progress message and disable log out button', () => {
//       userProfileFragment.getLogOutButton().should('have.attr', 'disabled');
//       userProfileFragment.getNotification().should('be.visible');
//       userProfileFragment
//         .getNotification()
//         .should(
//           'contain.text',
//           `You can't log out because picking is in progress`
//         );
//       userProfileFragment.getReceiveDataButton().should('not.exist');
//     });
//   });

//   describe('when receive data button is clicked', () => {
//     beforeEach(() => {
//       cy.intercept('POST', /.+\/picking-lists\/.+\/start-picking$/).as(
//         'startPicking'
//       );

//       userProfileFragment.getCloseButton().click();
//       listsFragment.getStartPickingButtons().eq(1).click();
//       cy.wait('@startPicking', { timeout: 30000 });
//       cy.visit('/');
//       listsFragment.getPickingListsItems().should('have.length', 1);
//       listsHeaderFragment.getUserIcon().click();
//       userProfileFragment.getWrapper().should('be.visible');
//       userProfileFragment.getReceiveDataButton().click();
//     });

//     it('should receive data', () => {
//       userProfileFragment.getWrapper().should('not.be.visible');
//       cy.location('pathname').should('not.to.match', /^\/login/);
//       loginPage.getWrapper().should('not.exist');
//       listsFragment.getPickingListsItems().should('have.length', 2);
//     });
//   });
// });
