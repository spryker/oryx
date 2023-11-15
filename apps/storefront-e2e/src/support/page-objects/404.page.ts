import { AbstractSFPage } from './abstract.page';

export class NotFoundPage extends AbstractSFPage {
  url = '/cartsssss';

  waitForLoaded(): void {
    // no need to wait for anything (previously we waited for youtube video)
  }

  getTitle = () => cy.get('oryx-heading h1');
}
