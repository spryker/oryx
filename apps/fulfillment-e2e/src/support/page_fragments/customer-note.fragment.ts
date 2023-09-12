import { PickingInProgressModalFragment } from './picking-in-progress-modal.fragment';

export class CustomerNoteFragment {
  getWrapper = () => cy.get('oryx-picking-customer-note');
  getHeadline = () => this.getWrapper().find('oryx-heading');
  getIllustration = () => this.getWrapper().find('oryx-image');
  getNavigateBackButton = () =>
    this.getWrapper().find('oryx-picking-navigate-back');
  getNote = () => this.getWrapper().find('p');
  getProceedToPickingButton = () => this.getWrapper().find('oryx-button').eq(0);
  pickingInProgressModal = new PickingInProgressModalFragment();
}
