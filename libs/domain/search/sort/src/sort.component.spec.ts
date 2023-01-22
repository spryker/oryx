import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/experience';
import { html } from 'lit';
import { of } from 'rxjs';
import { SortingService } from '../../src/services/sorting.service';
import { SortComponent } from './sort.component';
import { sortComponent } from './sort.def';

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
}

describe('DefaultSortingService', () => {
  let element: SortComponent;
  let mockSortingService: MockSortingService;
  let mockRouterService: MockRouterService;

  beforeAll(async () => {
    await useComponent(sortComponent);
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

    vi.spyOn(mockSortingService, 'get');
    vi.spyOn(mockRouterService, 'getUrl');
    vi.spyOn(mockRouterService, 'navigate');

    element = await fixture(html`<search-product-sort></search-product-sort>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SortComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should get data from sorting service', () => {
    expect(mockSortingService.get).toHaveBeenCalled();
  });

  it('should render an option for every sort parameter', () => {
    expect(element.shadowRoot?.querySelectorAll('option').length).toBe(
      mockSort.sortValues.length + 1
    );
  });

  describe('select handling', () => {
    let changeEvent: Event;

    beforeEach(() => {
      changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
    });

    it('It should resolve url from router', () => {
      element.shadowRoot?.querySelector('option')?.dispatchEvent(changeEvent);
      expect(mockRouterService.getUrl).toHaveBeenCalled();
    });

    it('It should navigate using router', () => {
      element.shadowRoot?.querySelector('option')?.dispatchEvent(changeEvent);
      expect(mockRouterService.navigate).toHaveBeenCalled();
    });
  });
});
