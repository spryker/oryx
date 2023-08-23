import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ApiProductListModel } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { of, take } from 'rxjs';
import { beforeEach } from 'vitest';
import { facetRatingNormalizer } from './facet-rating.normalizer';

const mockRatingFacet: ApiProductListModel.RangeFacet = {
  activeMax: 5,
  activeMin: 4,
  config: { parameterName: 'rating[min]', isMultiValued: false },
  docCount: null,
  localizedName: 'Product rating',
  max: 5,
  min: 1,
  name: 'Rating',
};

class MockRouterService implements Partial<RouterService> {
  currentQuery = vi.fn().mockReturnValue(of({}));
}

const generateNoramalizedFacet = (
  facet: ApiProductListModel.RangeFacet,
  disabledValuesIndex: number[]
) => {
  return {
    name: facet.localizedName,
    parameter: facet.config.parameterName,
    selectedValues: [],
    valuesTreeLength: facet.max - facet.min + 1,
    values: Array.from(new Array(5).keys())
      .reverse()
      .map((i) => {
        const value = i + 1;
        return {
          value: String(value),
          selected: false,
          count: 0,
          disabled: disabledValuesIndex.includes(i),
        };
      }),
  };
};

describe('Product Facet Normalizers', () => {
  let routerService: MockRouterService;

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    routerService = injector.inject<MockRouterService>(RouterService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should return normalized rating facet-navigation', () => {
    facetRatingNormalizer(mockRatingFacet)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toEqual({
          name: mockRatingFacet.localizedName,
          parameter: mockRatingFacet.config.parameterName,
          selectedValues: [],
          valuesTreeLength: mockRatingFacet.max - mockRatingFacet.min + 1,
          values: Array.from(new Array(5).keys())
            .map((i) => {
              const value = i + 1;
              return {
                value: String(value),
                selected: false,
                count: 0,
                disabled: false,
              };
            })
            .reverse(),
        });
      });
  });

  describe('when router has "rating[min]" param', () => {
    beforeEach(() => {
      routerService.currentQuery = vi.fn().mockReturnValue(
        of({
          'rating[min]': '4',
        })
      );
    });

    it('should return normalized rating facet with selected value', () => {
      facetRatingNormalizer(mockRatingFacet)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            name: mockRatingFacet.localizedName,
            parameter: mockRatingFacet.config.parameterName,
            selectedValues: ['4'],
            valuesTreeLength: mockRatingFacet.max - mockRatingFacet.min + 1,
            values: Array.from(new Array(5).keys())
              .map((i) => {
                const value = i + 1;
                return {
                  value: String(value),
                  selected: value === 4,
                  count: 0,
                  disabled: false,
                };
              })
              .reverse(),
          });
        });
    });
  });

  describe('when min is greater then 1', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      min: 2,
    };

    const callback = vi.fn();

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet with first value as disabled', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet, [0])
      );
    });
  });

  describe('when max is less then 5', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      max: 4,
    };

    const callback = vi.fn();

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet with last value as disabled', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet, [
          modifiedMockRatingFacet.max,
        ])
      );
    });
  });

  describe('when min is greater then 1 and max is less then 5', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      min: 2,
      max: 4,
    };

    const callback = vi.fn();

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet with first value as disabled', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet, [
          0,
          modifiedMockRatingFacet.max,
        ])
      );
    });
  });
});
