export class BreadcrumbFragment {
  get = () => cy.get('oryx-site-breadcrumb');
  lastBreadcrumbItem = () => this.get().find('a:last-of-type');
  nthBreadcrumbItem = (n: number) => this.get().find(`a:nth-of-type(${n})`);

  shouldHaveHomePageLink(): void {
    const link = this.get().find('a:first-of-type');
    link.should('contain.text', 'Home');
    link.invoke('attr', 'href').should('eq', '/');
  }

  shouldHaveDividers(quantity: number): void {
    this.get().find('oryx-icon').should('have.length', quantity);
  }
}
