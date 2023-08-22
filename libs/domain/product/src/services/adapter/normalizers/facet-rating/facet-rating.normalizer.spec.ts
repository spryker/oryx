import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of, take } from 'rxjs';
import { facetRatingNormalizer } from './facet-rating.normalizer';

const mockRatingFacet = {
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

    routerService = injector.inject(
      RouterService
    ) as unknown as MockRouterService;
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

  describe('when min is greater then 1 and max is less then 5', () => {
    beforeEach(() => {
      mockRatingFacet.min = 2;
      mockRatingFacet.max = 4;
    });

    it('should return normalized rating facet with disabled options', () => {
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
                  disabled:
                    value < mockRatingFacet.min || value > mockRatingFacet.max,
                };
              })
              .reverse(),
          });
        });
    });
  });
});
