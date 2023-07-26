import { AbstractSFPage } from './abstract.page';
import { Category } from '../types/category.type';
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
  getOryxCards = () => cy.get('oryx-product-card');
  getProductSort = () => cy.get('oryx-search-product-sort');
}
