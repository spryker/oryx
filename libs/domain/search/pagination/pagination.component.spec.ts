import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Pagination, ProductListPageService } from '@spryker-oryx/product';
import { PaginationComponent } from '@spryker-oryx/ui/pagination';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { SearchPaginationComponent } from './pagination.component';
import { searchPaginationComponent } from './pagination.def';
import { SearchPaginationOptions } from './pagination.model';

const options: SearchPaginationOptions = {
  max: 4,
  enableControls: false,
};

const mockPagination: Pagination = {
  maxPage: 10,
  numFound: 100,
  itemsPerPage: 10,
  currentPage: 3,
};

class MockProductListPageService implements Partial<ProductListPageService> {
  getPagination = vi.fn().mockReturnValue(of(mockPagination));
}

describe('SearchPaginationComponent', () => {
  let element: SearchPaginationComponent;

  const getPagination = () =>
    element.renderRoot.querySelector<PaginationComponent>('oryx-pagination');

  beforeAll(async () => {
    await useComponent(searchPaginationComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ProductListPageService,
          useClass: MockProductListPageService,
        },
      ],
    });

    element = await fixture(html`
      <oryx-search-pagination .options=${options}></oryx-search-pagination>
    `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SearchPaginationComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it(`should render ${mockPagination.maxPage} pagination items`, () => {
    expect(
      element.renderRoot.querySelectorAll('oryx-pagination a').length
    ).toBe(mockPagination.maxPage);
  });

  it('should properly generate pagination links', () => {
    element.renderRoot
      .querySelectorAll('oryx-pagination a')
      .forEach((anchor, index) => {
        const href = anchor.getAttribute('href');

        expect(href).toBe(
          `${window.location.origin}${window.location.pathname}?page=${
            index + 1
          }`
        );
      });
  });

  it('should set current page', () => {
    expect(getPagination()?.current).toBe(mockPagination.currentPage);
  });

  it('should pass the specified options to oryx-pagination component', () => {
    expect(getPagination()?.max).toBe(options.max);
    expect(getPagination()?.hasAttribute('enableNavigation')).toBe(false);
  });
});
