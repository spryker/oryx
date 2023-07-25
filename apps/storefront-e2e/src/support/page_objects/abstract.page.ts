import { FooterFragment } from '../page_fragments/footer.fragment';
import { HeaderFragment } from '../page_fragments/header.fragment';
import { GlobalNotificationCenter } from '../page_fragments/global-notification-center.fragment';
import { SearchFragment } from '../page_fragments/search.fragment';

export abstract class AbstractSFPage {
  abstract url: string;

  visit(): void {
    if (!this.url) {
      throw new Error(
        'It is not possibe to visit this page bacause `url` is not set.'
      );
    }

    this.beforeVisit();
    cy.visit(this.url);
    this.waitForLoaded();
  }

  header = new HeaderFragment();
  footer = new FooterFragment();
  search = new SearchFragment();
  globalNotificationCenter = new GlobalNotificationCenter();

  /**
   * Initializes cypress interceptors
   *
   * The method is called before page is visited
   *
   * It is empty because not all pages need interceptors
   * so it can't be abstract
   */
  beforeVisit(): void {
    //
  }

  /**
   * Method should contain a check that will be TRUE
   * when concrete page was successfully rendered
   *
   * It might be a simple element.should('be.visible') check
   * or something more complicated, like API requests interception
   * or Page Fragments initialization checks
   */
  abstract waitForLoaded(): void;
}
