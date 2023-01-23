import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Pagination, ProductListPageService } from '@spryker-oryx/product';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { PaginationComponent } from './pagination.component';
import { paginationComponent } from './pagination.def';
import { PaginationOptions } from './pagination.model';

const options: PaginationOptions = {
  max: 4,
  hideControls: true,
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

describe('PaginationComponent', () => {
  let element: PaginationComponent;

  beforeAll(async () => {
    await useComponent(paginationComponent);
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
    expect(element).toBeInstanceOf(PaginationComponent);
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
    const current = element.renderRoot
      .querySelector('oryx-pagination')
      ?.getAttribute('current');

    expect(Number(current)).toBe(mockPagination.currentPage);
  });

  it('should pass the specified options to oryx-pagination component', () => {
    const max = element.renderRoot
      .querySelector('oryx-pagination')
      ?.getAttribute('max');
    const isHideNavigationAttribute = element.renderRoot
      .querySelector('oryx-pagination')
      ?.hasAttribute('hideNavigation');

    expect(Number(max)).toBe(options.max);
    expect(isHideNavigationAttribute).toBe(true);
  });
});
