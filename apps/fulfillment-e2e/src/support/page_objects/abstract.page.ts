export class AbstractFAPage {
  url: string;

  visit(): void {
    cy.visit(this.url);
  }
}
