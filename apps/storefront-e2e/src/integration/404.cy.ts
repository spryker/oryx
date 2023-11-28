import { NotFoundPage } from '../support/page-objects/404.page';
import { ContactPage } from '../support/page-objects/contact.page';

const notFoundPage = new NotFoundPage();
const contactPage = new ContactPage();

describe('404', () => {
  it('should show 404 page when user navigates to non-existing page', () => {
    notFoundPage.visit();
    notFoundPage.getTitle().should('be.visible');
    notFoundPage.getTitle().contains('Error 404');
  });

  it('should not show 404 page when user navigates to existing with slash in the end', () => {
    contactPage.updateUrl('/contact/');
    contactPage.visit();
    contactPage.getHeading().should('be.visible');
  });
});
