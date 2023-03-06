import { AbstractSFPage } from './abstract.page';

export class LandingPage extends AbstractSFPage {
  url = '/';

  waitForLoadedSSR(): void {
    this.getVideo().should('be.visible');
  }

  waitForLoadedSPA(): void {
    this.waitForLoadedSSR();
  }

  getVideo = () => cy.get('oryx-video');
}
