export class BreadcrumbsFragment {
  get = () => cy.get('oryx-site-breadcrumbs');
  nthBreadcrumb = (n: number) => this.get().find('a').eq(n);

  shouldHaveHomePageLink(): void {
    this.nthBreadcrumb(0)
      .should('contain.text', 'Home')
      .invoke('attr', 'href')
      .should('eq', '/');
  }

  shouldHaveDividers(quantity: number): void {
    this.get().find('oryx-icon').should('have.length', quantity);
  }
}
