export abstract class ABackofficePage {
  url: string;

  visit = () => {
    cy.visit(`${Cypress.env('backofficeUrl')}/${this.url}`);
  };
}
