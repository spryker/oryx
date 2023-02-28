import { AbstractSFPage } from './abstract.page';

export class LandingPage extends AbstractSFPage {
  url = '/';

  waitForLoaded(): void {
    this.video().should('be.visible')
  }

  video = () => cy.get('oryx-video')
}
