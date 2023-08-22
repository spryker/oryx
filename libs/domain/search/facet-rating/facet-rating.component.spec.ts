import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { generateRatingFacet } from '@spryker-oryx/product/mocks';
import {
  FacetListService,
  searchRatingFacetComponent,
} from '@spryker-oryx/search';
import { SearchFacetComponent } from '@spryker-oryx/search/facet';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchRatingFacetComponent } from './facet-rating.component';

const mockFacet = generateRatingFacet();

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('FacetRatingComponent', () => {
  let element: SearchRatingFacetComponent;

  beforeAll(async () => {
    await useComponent(searchRatingFacetComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-search-facet-rating name="Rating"></oryx-search-facet-rating>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should extend SearchFacetComponent', () => {
    expect(element).toBeInstanceOf(SearchFacetComponent);
  });

  it('should override renderValueControlLabel', () => {
    expect(element.renderRoot.querySelectorAll('oryx-rating').length).toBe(
      (mockFacet.values as FacetValue[]).length
    );
  });

  it('should render "& up" for values less than 5', () => {
    const ratings = element.renderRoot.querySelectorAll('oryx-rating');

    (mockFacet.values as FacetValue[]).forEach((value, index) => {
      if (Number(value) <= 4) {
        expect(ratings[index]?.nextElementSibling?.textContent).toBe('& up');
      }
    });
  });

  it('should not render "& up" for value 5', () => {
    expect(
      element.renderRoot.querySelector('oryx-rating[value="5"]')
        ?.nextElementSibling
    ).toBe(null);
  });

  it('should render each oryx-rating with "readonly" attribute', () => {
    const ratings = element.renderRoot.querySelectorAll('oryx-rating');

    ratings.forEach((rating) => {
      expect(rating.hasAttribute('readonly')).toBe(true);
    });
  });

  it('should render each oryx-rating with scale 5', () => {
    const ratings = element.renderRoot.querySelectorAll('oryx-rating');

    ratings.forEach((rating) => {
      expect(rating.getAttribute('scale')).toBe('5');
    });
  });
});
