import { NotFoundPage } from '../support/page-objects/404.page';

const notFoundPage = new NotFoundPage();

describe('404', () => {
  it('should show 404 page when user navigates to non-existing page', () => {
    notFoundPage.visit();
    notFoundPage.getTitle().should('be.visible');
    notFoundPage.getTitle().contains('Error 404');
  });
});
