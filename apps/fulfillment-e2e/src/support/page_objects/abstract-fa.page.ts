export class AFAPage {
  url: string;

  visit(): void {
    cy.visit(this.url);
  }
}
