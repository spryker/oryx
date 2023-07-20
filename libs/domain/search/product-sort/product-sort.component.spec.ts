import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SortingService } from '@spryker-oryx/search';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchProductSortComponent } from './product-sort.component';
import { searchProductSortComponent } from './product-sort.def';

const mockSort = {
  sortOrder: null,
  sortParam: 'nameAsc',
  sortValues: [
    {
      sortKey: 'rating',
      sortName: 'Sort by product ratings',
    },
    {
      sortKey: 'nameAsc',
      sortName: 'Sort by name ascending',
    },
    {
      sortKey: 'nameDesc',
      sortName: 'Sort by name descending',
    },
    {
      sortKey: 'priceAsc',
      sortName: 'Sort by price ascending',
    },
    {
      sortKey: 'priceDesc',
      sortName: 'Sort by price descending',
    },
    {
      sortKey: 'popularity',
      sortName: 'Sort by popularity',
    },
  ],
};

class MockSortingService implements Partial<SortingService> {
  get = vi.fn().mockReturnValue(of(mockSort));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn().mockReturnValue(of({}));
  getUrl = vi.fn().mockReturnValue(of(''));
  currentQuery = vi.fn().mockReturnValue(of(''));
}

describe('SearchSortComponent', () => {
  let element: SearchProductSortComponent;
  let mockSortingService: MockSortingService;
  let mockRouterService: MockRouterService;

  beforeAll(async () => {
    await useComponent(searchProductSortComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SortingService,
          useClass: MockSortingService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    mockSortingService = testInjector.inject(
      SortingService
    ) as unknown as MockSortingService;

    mockRouterService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    element = await fixture(
      html`<oryx-search-product-sort></oryx-search-product-sort>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should get data from sorting service', () => {
    expect(mockSortingService.get).toHaveBeenCalled();
  });

  it('should render an option for every sort parameter', () => {
    expect(
      element.renderRoot.querySelectorAll('option:not([hidden])').length
    ).toBe(mockSort.sortValues.length);
  });

  describe('when option is selected', () => {
    beforeEach(() => {
      element.renderRoot.querySelector('option')?.dispatchEvent(
        new InputEvent('change', {
          bubbles: true,
          cancelable: true,
        })
      );
    });

    it('should resolve url from router', () => {
      expect(mockRouterService.getUrl).toHaveBeenCalled();
    });

    it('should navigate using router', () => {
      expect(mockRouterService.navigate).toHaveBeenCalled();
    });
  });
});
