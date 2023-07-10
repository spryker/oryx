import { FooterFragment } from '../page_fragments/footer.fragment';
import { HeaderFragment } from '../page_fragments/header.fragment';
import { SearchFragment } from '../page_fragments/search.fragment';

export abstract class AbstractSFPage {
  abstract url: string;

  visit(): void {
    if (!this.url) {
      throw new Error(
        'It is not possibe to visit this page bacause `url` is not set.'
      );
    }

    cy.visit(this.url);
  }

  header = new HeaderFragment();
  footer = new FooterFragment();
  search = new SearchFragment();

  /**
   * Method should contain a check that will be TRUE
   * when concrete page was successfully rendered in SPA mode
   *
   * It might be a simple element.should('be.visible') check
   * or something more complicated, like API requests interception
   * or Page Fragments initialization checks
   */
  abstract waitForLoadedSPA(): void;

  /**
   * Method should contain a check that will be TRUE
   * when concrete page was successfully rendered in SSR mode
   *
   * It might be a simple element.should('be.visible') check
   * or something more complicated, like API requests interception
   * or Page Fragments initialization checks
   */
  abstract waitForLoadedSSR(): void;
}
