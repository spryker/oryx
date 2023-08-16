import { Category } from '../types/category.type';
import { AbstractSFPage } from './abstract.page';
export class CategoryPage extends AbstractSFPage {
  url = '/category/';
  categoryId: string;

  constructor(categoryData?: Category) {
    super();

    if (categoryData) {
      this.categoryId = categoryData.id;
      this.url += categoryData.id;
    }
  }

  waitForLoaded(): void {
    this.getFacets().should('be.visible');
  }

  getFacets = () => cy.get('oryx-search-facet');
  getRadio = () => cy.get('input[type="radio"]');
  getProductCard = () => cy.get('oryx-product-card');
  getProductPrice = () => cy.get('oryx-site-price');
  getProductSort = () => cy.get('oryx-search-product-sort');
  getProductTitle = () => cy.get('oryx-product-title');
  getOryxCheckbox = () => cy.get('oryx-checkbox');
}
