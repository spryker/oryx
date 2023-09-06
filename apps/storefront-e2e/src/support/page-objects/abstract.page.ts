import { FooterFragment } from '../page-fragments/footer.fragment';
import { GlobalNotificationCenter } from '../page-fragments/global-notification-center.fragment';
import { HeaderFragment } from '../page-fragments/header.fragment';
import { SearchBoxFragment } from '../page-fragments/search-box.fragment';

export type E2EPage = {
  url: string;
  visit(): void;
  beforeVisit(): void;
  waitForLoaded(): void;
};

export abstract class AbstractSFPage implements E2EPage {
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
  searchbox = new SearchBoxFragment();
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
