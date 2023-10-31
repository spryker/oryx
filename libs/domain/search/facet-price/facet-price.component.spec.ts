import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { generateRange } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { CurrencyService } from '@spryker-oryx/site';
import { InputComponent } from '@spryker-oryx/ui/input';
import { MultiRangeComponent } from '@spryker-oryx/ui/multi-range';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchPriceFacetComponent } from './facet-price.component';
import { searchPriceFacetComponent } from './facet-price.def';

const name = 'Mock';
const min = 100;
const max = 1000;
const mockFacet = generateRange(name, 'parameter', [min, max]);
const mockCurrency = 'mockCurrency';

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

class MockCurrencyService implements Partial<CurrencyService> {
  getCurrencySymbol = vi.fn().mockReturnValue(of(mockCurrency));
}

describe('SearchPriceFacetComponent', () => {
  let element: SearchPriceFacetComponent;
  let service: MockFacetListService;

  const getInput = (isMax = false): InputComponent => {
    return element.renderRoot.querySelectorAll('oryx-input')[
      +isMax
    ] as InputComponent;
  };

  const getRange = (): MultiRangeComponent => {
    return element.renderRoot.querySelector(
      'oryx-multi-range'
    ) as MultiRangeComponent;
  };

  beforeAll(async () => {
    await useComponent(searchPriceFacetComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-search-price-facet name=${name}></oryx-search-price-facet>`
    );

    service = testInjector.inject<MockFacetListService>(FacetListService);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should have default labels', () => {
    expect(element.labelMin).toBe('price.label.min-<currency>');
    expect(element.labelMax).toBe('price.label.max-<currency>');
  });

  it('should add currency to the input`s labels', () => {
    expect(getInput().label).toContain(mockCurrency);
    expect(getInput(true).label).toContain(mockCurrency);
  });

  it('should convert the price values', () => {
    const range = getRange();
    expect(range.min).toBe(min / 100);
    expect(range.max).toBe(max / 100);
    expect(range.minValue).toBe(min / 100);
    expect(range.maxValue).toBe(max / 100);
  });

  describe('when values are not round', () => {
    beforeEach(async () => {
      const mockFacet = generateRange(name, 'parameter', [99, 999]);
      service.getFacet.mockReturnValue(of(mockFacet));
      element = await fixture(
        html`<oryx-search-price-facet name=${name}></oryx-search-price-facet>`
      );
    });

    it('should round min values down and max values up', () => {
      const range = getRange();
      expect(range.min).toBe(0);
      expect(range.max).toBe(10);
      expect(range.minValue).toBe(0);
      expect(range.maxValue).toBe(10);
    });
  });
});
