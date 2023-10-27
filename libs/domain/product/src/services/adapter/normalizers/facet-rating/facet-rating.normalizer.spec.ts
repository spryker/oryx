import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ApiProductListModel, FacetType } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { of, take } from 'rxjs';
import { beforeEach } from 'vitest';
import { facetRatingNormalizer } from './facet-rating.normalizer';

const mockRatingFacet: ApiProductListModel.RangeFacet = {
  activeMax: 5,
  activeMin: 4,
  config: { parameterName: 'rating', isMultiValued: false },
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
  selectedValue?: number
) => {
  const valuesCount = facet.max ? facet.max - facet.min + 1 : 0;

  return {
    type: FacetType.Single,
    name: facet.localizedName,
    parameter: facet.config.parameterName,
    selectedValues: selectedValue ? [String(selectedValue)] : [],
    valuesTreeLength: valuesCount,
    values: Array.from(new Array(valuesCount).keys())
      .reverse()
      .map((i) => {
        const value = i + facet.min;
        return {
          value: String(value),
          selected: selectedValue ? selectedValue === value : false,
          count: 0,
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

  const callback = vi.fn();

  describe('when facet is provided', () => {
    beforeEach(() => {
      facetRatingNormalizer(mockRatingFacet).pipe(take(1)).subscribe(callback);
    });

    it('should return normalized rating facet', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(mockRatingFacet)
      );
    });
  });

  describe('when router has "rating" param', () => {
    const ratingMin = 4;

    beforeEach(() => {
      routerService.currentQuery = vi.fn().mockReturnValue(
        of({
          rating: String(ratingMin),
        })
      );
    });

    it('should return normalized rating facet with selected value', () => {
      facetRatingNormalizer(mockRatingFacet).pipe(take(1)).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(mockRatingFacet, ratingMin)
      );
    });
  });

  describe('when min and max are equal', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      min: 4,
      max: 4,
    };

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet with one value', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet)
      );
    });
  });

  describe('when max is 0', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      max: 0,
    };

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet with no values', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet)
      );
    });
  });

  describe('when min is greater then 1', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      min: 2,
    };

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet without first value', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet)
      );
    });
  });

  describe('when max is less then 5', () => {
    const modifiedMockRatingFacet = {
      ...mockRatingFacet,
      max: 4,
    };

    beforeEach(() => {
      facetRatingNormalizer(modifiedMockRatingFacet)
        .pipe(take(1))
        .subscribe(callback);
    });

    it('should return normalized rating facet without last value', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet)
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

    it('should return normalized rating facet without first and last values', () => {
      expect(callback).toHaveBeenCalledWith(
        generateNoramalizedFacet(modifiedMockRatingFacet)
      );
    });
  });
});
