import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { generateRatingFacet } from '@spryker-oryx/product/mocks';
import {
  FacetListService,
  searchRatingFacetComponent,
} from '@spryker-oryx/search';
import { SearchFacetComponent } from '@spryker-oryx/search/facet';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchRatingFacetComponent } from './facet-rating.component';

const mockFacet = generateRatingFacet(1, 5, 5);
class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('FacetRatingComponent', () => {
  let facetListService: FacetListService;
  let element: SearchRatingFacetComponent;

  beforeAll(async () => {
    await useComponent(searchRatingFacetComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
      ],
    });

    facetListService = testInjector.inject(FacetListService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when there is no options limitation', () => {
    const options = {
      min: 1,
      max: 5,
      scale: 5,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should extend SearchFacetComponent', () => {
      expect(element).toBeInstanceOf(SearchFacetComponent);
    });

    it('should override renderValueControlLabel', () => {
      expect(element.renderRoot.querySelectorAll('oryx-rating').length).toBe(
        (mockFacet.values as FacetValue[]).length
      );
    });

    it('should render "& up" for all values except biggest one', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        if (Number(value) <= 4) {
          expect(ratings[index]?.nextElementSibling?.textContent).toBe(
            i18n('search.facet.rating.up')
          );
        }
      });
    });

    it('should not render "& up" for biggest value', () => {
      expect(
        element.renderRoot.querySelector(`oryx-rating[value="${options.max}"]`)
          ?.nextElementSibling
      ).toBe(null);
    });

    it('should render each oryx-rating with "readonly" attribute', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      ratings.forEach((rating) => {
        expect(rating.hasAttribute('readonly')).toBe(true);
      });
    });

    it('should render each oryx-rating with provided scale', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      ratings.forEach((rating) => {
        expect(rating.getAttribute('scale')).toBe(options.scale.toString());
      });
    });
  });

  describe('when there are options limitations', () => {
    const options = {
      min: 2,
      max: 4,
      scale: 5,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render values from min to max', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(options.max - options.min + 1);

      ratings.forEach((rating, index) => {
        expect(rating.getAttribute('value')).toBe(String(options.max - index));
      });
    });

    it('should render "& up" for all values', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      ratings.forEach((rating) => {
        expect(rating?.nextElementSibling?.textContent).toBe(
          i18n('search.facet.rating.up')
        );
      });
    });
  });

  describe('when avaliable rating is smaller then limitation', () => {
    const options = {
      min: 1,
      max: 5,
      scale: 5,
    };

    beforeEach(async () => {
      facetListService.getFacet = vi
        .fn()
        .mockReturnValue(of(generateRatingFacet(1, 4, 5)));

      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render only avaliable values', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(
        Number((mockFacet.values as FacetValue[])[0].value) - options.min
      );

      ratings.forEach((rating, index) => {
        expect(rating.getAttribute('value')).toBe(
          String(ratings.length - index)
        );
      });
    });
  });

  describe('when there is no scale option provided', () => {
    const options = {
      min: 1,
      max: 5,
      scale: undefined,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should not render values', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(0);
    });
  });

  describe('when there is no min option provided', () => {
    const options = {
      min: undefined,
      max: 5,
      scale: 5,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render values from 1 to "max"', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(options.max);

      ratings.forEach((rating, index) => {
        expect(rating.getAttribute('value')).toBe(
          String(ratings.length - index)
        );
      });
    });
  });

  describe('when there is no max option provided', () => {
    const options = {
      min: 1,
      max: undefined,
      scale: 5,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render values from "min" to "scale"', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      ratings.forEach((rating, index) => {
        expect(rating.getAttribute('value')).toBe(
          String(options.scale - index)
        );
      });
    });
  });

  describe('when min less than 1', () => {
    const options = {
      min: 0,
      max: 5,
      scale: 5,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render values from 1 to "max"', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(options.max);

      ratings.forEach((rating, index) => {
        expect(rating.getAttribute('value')).toBe(
          String(ratings.length - index)
        );
      });
    });
  });
  describe('when max is greater then scale', () => {
    const options = {
      min: 1,
      max: 4,
      scale: 3,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render values from 1 to "scale"', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(options.scale - options.min + 1);

      ratings.forEach((rating, index) => {
        expect(rating.getAttribute('value')).toBe(
          String(ratings.length - index)
        );
      });
    });
  });
  describe('when min is greater then max', () => {
    const options = {
      min: 4,
      max: 1,
      scale: 5,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name="Rating"
          .options=${options}
        ></oryx-search-facet-rating>`
      );
    });

    it('should not render values', () => {
      const ratings = element.renderRoot.querySelectorAll('oryx-rating');

      expect(ratings.length).toBe(0);
    });
  });
});
