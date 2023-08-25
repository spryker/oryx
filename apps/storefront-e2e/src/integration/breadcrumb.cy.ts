import { CategoryPage } from '../support/page-objects/category.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { SearchPage } from '../support/page-objects/search.page';
import { CategoryStorage } from '../support/test-data/storages/category.storage';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const product = ProductStorage.getByEq(0);
const parentCategory = CategoryStorage.getByEq(0);
const childCategory = CategoryStorage.getByEq(1);

const searchPage = new SearchPage();
const categoryPage = new CategoryPage(childCategory);
const pdp = new ProductDetailsPage(product);

describe('Breadcrumb suite', () => {
  it('should render breadcrumb for the product list page', () => {
    searchPage.visit();

    searchPage.breadcrumb.get().should('be.visible');

    //first link should be home
    searchPage.breadcrumb.shouldHaveHomePageLink();
    //should have 1 divider
    searchPage.breadcrumb.shouldHaveDividers(1);

    searchPage.breadcrumb.lastBreadcrumbItem().should('contain.text', 'Search');

    //when search query is provided
    searchPage.url = `${searchPage.url}?q=test`;
    searchPage.visit();

    //first link should be home
    searchPage.breadcrumb.shouldHaveHomePageLink();
    //should have 1 divider
    searchPage.breadcrumb.shouldHaveDividers(1);

    searchPage.breadcrumb
      .lastBreadcrumbItem()
      .should('contain.text', 'Search for "test"');
  });

  it('should render breadcrumb for the product details page', () => {
    pdp.visit();

    searchPage.breadcrumb.get().should('be.visible');

    //first link should be home
    searchPage.breadcrumb.shouldHaveHomePageLink();
    //should have 1 divider
    searchPage.breadcrumb.shouldHaveDividers(1);

    //should render product's title as the last breadcrumb
    searchPage.breadcrumb
      .lastBreadcrumbItem()
      .should('contain.text', product.title);
  });

  it('should render breadcrumb for the categories page', () => {
    categoryPage.visit();

    searchPage.breadcrumb.get().should('be.visible');

    //first link should be home
    searchPage.breadcrumb.shouldHaveHomePageLink();
    //should have 2 dividers
    searchPage.breadcrumb.shouldHaveDividers(2);

    //should render parent category as second breadcrumb
    searchPage.breadcrumb
      .nthBreadcrumbItem(2)
      .should('contain.text', parentCategory.title);
    //should have proper link
    searchPage.breadcrumb
      .nthBreadcrumbItem(2)
      .invoke('attr', 'href')
      .should('eq', `/category/${parentCategory.id}`);

    //should render child category as the last breadcrumb
    searchPage.breadcrumb
      .lastBreadcrumbItem()
      .should('contain.text', childCategory.title);

    //when click on parent category
    searchPage.breadcrumb.nthBreadcrumbItem(2).click();

    //should have 1 divider
    searchPage.breadcrumb.shouldHaveDividers(1);

    //should render parent category as the last breadcrumb
    searchPage.breadcrumb
      .lastBreadcrumbItem()
      .should('contain.text', parentCategory.title);
  });
});
