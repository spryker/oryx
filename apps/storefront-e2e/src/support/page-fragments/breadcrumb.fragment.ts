export class BreadcrumbFragment {
  get = () => cy.get('oryx-site-breadcrumb');
  nthBreadcrumbItem = (n: number) => this.get().find('oryx-button').eq(n);

  shouldHaveHomePageLink(): void {
    this.nthBreadcrumbItem(0)
      .should('contain.text', 'Home')
      .find('a')
      .invoke('attr', 'href')
      .should('eq', '/');
  }

  shouldHaveDividers(quantity: number): void {
    this.get().find('oryx-icon').should('have.length', quantity);
  }
}
