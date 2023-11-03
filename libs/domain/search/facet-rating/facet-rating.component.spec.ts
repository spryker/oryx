import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { generateRange } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { RatingComponent } from '@spryker-oryx/ui/rating';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchFacetValueNavigationComponent } from '../facet-value-navigation';
import { SearchRatingFacetComponent } from './facet-rating.component';
import { searchRatingFacetComponent } from './facet-rating.def';

const name = 'Rating';
const param = 'parameter';
const min = 1;
const max = 5;
const mockFacet = generateRange(name, param, [min, max]);

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('SearchRatingFacetComponent', () => {
  let element: SearchRatingFacetComponent;
  let service: MockFacetListService;

  const getInput = (value?: number): HTMLInputElement => {
    return element.renderRoot.querySelector(
      `input[value="${value}"]`
    ) as HTMLInputElement;
  };

  const getNavigation = (): SearchFacetValueNavigationComponent => {
    return element.renderRoot.querySelector(
      'oryx-search-facet-value-navigation'
    ) as SearchFacetValueNavigationComponent;
  };

  const shouldHaveProperOptions = (
    length = 4,
    start = 1,
    checked = 1,
    scale = 5
  ) => {
    const options = element.renderRoot.querySelectorAll('li');

    expect(options.length).toBe(length);

    Array.from(options)
      .reverse()
      .forEach((option, i) => {
        const value = start + i;
        const input = option.querySelector('input') as HTMLInputElement;
        const container = input.nextElementSibling;
        const rating = container?.querySelector(
          'oryx-rating'
        ) as RatingComponent;
        const hasText = value < scale;

        expect(input.value).toBe(String(value));
        expect(input.name).toBe(param);
        expect(input.getAttribute('aria-label')).toBe(String(value));
        expect(input.checked).toBe(value === checked);

        expect(rating.getAttribute('value')).toBe(String(value));
        expect(rating.getAttribute('scale')).toBe(String(scale));

        if (hasText) {
          expect(container).toContainElement('span');
        } else {
          expect(container).not.toContainElement('span');
        }
      });
  };

  beforeAll(async () => {
    await useComponent(searchRatingFacetComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-search-facet-rating name=${name}></oryx-search-facet-rating>`
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

  it('should render facet value navigation with default configuration', () => {
    expect(getNavigation().hasAttribute('open')).toBe(false);
    expect(getNavigation().hasAttribute('enableClear')).toBe(true);
    expect(getNavigation().hasAttribute('dirty')).toBe(false);
    expect(getNavigation().heading).toEqual(name);
  });

  it('should render 5 options with proper values', () => {
    shouldHaveProperOptions();
  });

  describe('when facet is not existing', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-search-facet-rating
          name="fakeMock"
        ></oryx-search-facet-rating>`
      );
    });

    it('should not render the content', () => {
      expect(getNavigation()).toBeNull();
    });
  });

  describe('when clear is disabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name=${name}
          disableClear
        ></oryx-search-facet-rating>`
      );
    });

    it('should disable clear action of value navigation', () => {
      expect(getNavigation().hasAttribute('enableClear')).toBe(false);
    });
  });

  describe('when rating option is selected', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name=${name}
          @oryx.select=${callback}
        ></oryx-search-facet-rating>`
      );

      getInput(3).dispatchEvent(new InputEvent('change'));
    });

    it('should dispatch oryx.select event with selected value', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            name,
            value: expect.objectContaining({
              selected: { min: 3 },
            }),
          }),
        })
      );
    });
  });

  describe('when min property is specified', () => {
    const min = 3;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name=${name}
          .options=${{ min }}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render 2 options with proper values', () => {
      shouldHaveProperOptions(2, min);
    });
  });

  describe('when max property is specified', () => {
    const max = 5;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name=${name}
          .options=${{ max }}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render 3 options with proper values', () => {
      shouldHaveProperOptions(5);
    });
  });

  describe('when scale is less than max value', () => {
    const scale = 4;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-rating
          name=${name}
          .options=${{ max: 5, scale }}
        ></oryx-search-facet-rating>`
      );
    });

    it('should render 4 options with proper values', () => {
      shouldHaveProperOptions(4, 1, 1, scale);
    });
  });

  describe('when option is selected', () => {
    const selected = 3;

    beforeEach(async () => {
      service.getFacet.mockReturnValue(
        of(generateRange(name, param, [min, max], [selected, max]))
      );
      element = await fixture(
        html`<oryx-search-facet-rating name=${name}></oryx-search-facet-rating>`
      );
    });

    it(`should select the input with value: ${selected}`, () => {
      expect(getInput(selected).checked).toBe(true);
    });

    it('should render value navigation with dirty state', () => {
      expect(getNavigation().hasAttribute('dirty')).toBe(true);
    });
  });
});
