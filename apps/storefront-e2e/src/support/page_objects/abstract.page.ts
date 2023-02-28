import { HeaderFragment } from '../page_fragments/header.fragment';
import { SearchFragment } from '../page_fragments/search.fragment';

export abstract class AbstractSFPage {
  abstract url: string;

  visit(skipWait = false): void {
    if (!this.url) {
      throw new Error(
        'It is not possibe to visit this page bacause `url` is not set.'
      );
    }

    cy.visit(this.url);
    skipWait ? null : this.waitForLoaded();
  }

  header = new HeaderFragment();
  search = new SearchFragment();

  /**
   * Method should contain a check that will be TRUE
   * when concrete page is ready to be used by customer
   *
   * It might be a simple element.should('be.visible') check
   * or something more complicated, like API requests interception
   * or Page Fragments initialization checks
   */
  abstract waitForLoaded(): void;
}
