export class ProductRelationsFragment {
  getWrapper = () => cy.get('oryx-product-relations');
  getProducts = () => this.getWrapper().find('oryx-product-card');
  getCarouselNavigation = () =>
    this.getWrapper().find('oryx-carousel-navigation');
  getCarouselArrow = (type: string) =>
    this.getCarouselNavigation().find(`oryx-button.${type}`);
}
