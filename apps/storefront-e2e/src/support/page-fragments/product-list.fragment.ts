export class ProductListFragment {
  getWrapper = () => cy.get('oryx-product-relations + oryx-product-list');
  getNavigation = () => this.getWrapper().find(`oryx-carousel-navigation`);
  getButton = (type: string) =>
    this.getNavigation().find(`oryx-button.${type}`);
  getIndicator = (type: string | number) => {
    const pseudo = typeof type === 'number' ? `nth-child(${type})` : type;

    return this.getNavigation().find(`.indicators input:${pseudo}`);
  };
}
