import { ContactPage } from '../support/page_objects/contact.page';

const contactPage = new ContactPage();

describe('Contact us suite', () => {
  it('must open Contact us page', () => {
    contactPage.visit();
  });
});
