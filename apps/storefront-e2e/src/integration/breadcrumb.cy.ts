import { CategoryPage } from '../support/page-objects/category.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { SearchPage } from '../support/page-objects/search.page';
import { CategoryStorage } from '../support/test-data/storages/category.storage';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const product = ProductStorage.getByEq(1);
const parentCategory = CategoryStorage.getByEq(0);
const childCategory = CategoryStorage.getByEq(1);
const childCategory2 = CategoryStorage.getByEq(2);

describe('Breadcrumb suite', () => {
  it('should render breadcrumb for the search page', () => {
    const page = new SearchPage();
    page.visit();

    page.breadcrumb.get().should('be.visible');

    //first link should be home
    page.breadcrumb.shouldHaveHomePageLink();
    //should have 1 divider
    page.breadcrumb.shouldHaveDividers(1);

    //the last breadcrumb should be "Search"
    page.breadcrumb.nthBreadcrumbItem(-1).should('contain.text', 'Search');

    //when search query is provided
    page.url = `${page.url}?q=test`;
    page.visit();

    //first link should be home
    page.breadcrumb.shouldHaveHomePageLink();
    //should have 1 divider
    page.breadcrumb.shouldHaveDividers(1);

    //the last breadcrumb should be "Search for <query>"
    page.breadcrumb
      .nthBreadcrumbItem(-1)
      .should('contain.text', 'Search for "test"');
  });

  it('should render breadcrumb for the product details page', () => {
    const page = new ProductDetailsPage(product);
    page.visit();

    page.breadcrumb.get().should('be.visible');

    //first link should be home
    page.breadcrumb.shouldHaveHomePageLink();
    //should have 3 dividers
    page.breadcrumb.shouldHaveDividers(3);

    //should render parent category as second breadcrumb
    page.breadcrumb
      .nthBreadcrumbItem(1)
      .should('contain.text', parentCategory.title)
      .invoke('attr', 'href')
      .should('eq', `/category/${parentCategory.id}`);

    //should render child category as third breadcrumb
    page.breadcrumb
      .nthBreadcrumbItem(2)
      .should('contain.text', childCategory2.title)
      .invoke('attr', 'href')
      .should('eq', `/category/${childCategory2.id}`);

    //should render product's title as the last breadcrumb
    page.breadcrumb.nthBreadcrumbItem(-1).should('contain.text', product.title);
  });

  it('should render breadcrumb for the categories page', () => {
    const page = new CategoryPage(childCategory);
    page.visit();

    page.breadcrumb.get().should('be.visible');

    //first link should be home
    page.breadcrumb.shouldHaveHomePageLink();
    //should have 2 dividers
    page.breadcrumb.shouldHaveDividers(2);

    //should render parent category as second breadcrumb
    page.breadcrumb
      .nthBreadcrumbItem(1)
      .should('contain.text', parentCategory.title)
      .invoke('attr', 'href')
      .should('eq', `/category/${parentCategory.id}`);

    //should render child category as the last breadcrumb
    page.breadcrumb
      .nthBreadcrumbItem(-1)
      .should('contain.text', childCategory.title);

    //when click on parent category
    page.breadcrumb.nthBreadcrumbItem(1).click({ force: true });

    //should have 1 divider
    page.breadcrumb.shouldHaveDividers(1);

    //should render parent category as the last breadcrumb
    page.breadcrumb
      .nthBreadcrumbItem(-1)
      .should('contain.text', parentCategory.title);
  });
});
