export abstract class ABackofficePage {
  abstract url: string;

  visit = () => {
    cy.visit(`${Cypress.env('backofficeUrl')}${this.url}`);
  };
}
