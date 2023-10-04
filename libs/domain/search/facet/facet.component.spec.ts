import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { generateFacet } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { SearchFacetComponent } from './facet.component';
import { searchFacetComponent } from './facet.def';
import { FACET_SELECT_EVENT } from './facet.model';

const mockFacet = generateFacet('Mock', 'parameter', 10);

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('SearchFacetComponent', () => {
  let element: SearchFacetComponent;
  let service: MockFacetListService;

  beforeAll(async () => {
    await useComponent(searchFacetComponent);
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

    service = testInjector.inject<MockFacetListService>(FacetListService);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', async () => {
    element = await fixture(
      html`<oryx-search-facet name="Mock"></oryx-search-facet>`
    );

    expect(element).toBeInstanceOf(SearchFacetComponent);
  });

  it('passes the a11y audit', async () => {
    element = await fixture(
      html`<oryx-search-facet name="Mock"></oryx-search-facet>`
    );

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('attributes', () => {
    describe('name', () => {
      describe('is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should render children', () => {
          expect(element).toContainElement(
            'oryx-search-facet-value-navigation'
          );
        });
      });

      describe('is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet></oryx-search-facet>`
          );
        });

        it('should not render children', () => {
          expect(element).not.toContainElement(
            'oryx-search-facet-value-navigation'
          );
        });
      });
    });

    describe('renderLimit', () => {
      describe('is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet
              name="Mock"
              renderLimit="7"
            ></oryx-search-facet>`
          );
        });

        it('should render provided by renderLimit items length', () => {
          const facetValues = element.renderRoot.querySelectorAll('li');

          expect(facetValues.length).toBe(7);
        });
      });

      describe('is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should render 5 by default', () => {
          const facetValues = element.renderRoot.querySelectorAll('li');

          expect(facetValues.length).toBe(5);
        });
      });
    });

    describe('multi', () => {
      describe('is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet
              .multi=${true}
              name="Mock"
            ></oryx-search-facet>`
          );
        });

        it('should render input[type="checkbox"]', () => {
          expect(element).not.toContainElement('input[type="radio"]');
          expect(element).toContainElement('input[type="checkbox"]');
        });
      });

      describe('is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should render input[type="radio"]', () => {
          expect(element).toContainElement('input[type="radio"]');
          expect(element).not.toContainElement('input[type="checkbox"]');
        });
      });
    });

    describe('minForSearch', () => {
      describe('is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet
              .minForSearch=${5}
              name="Mock"
            ></oryx-search-facet>`
          );
        });

        it('should enable search for if facetValues length > minForSearch', () => {
          const valueNavigation = element.renderRoot.querySelector(
            'oryx-search-facet-value-navigation'
          );

          expect(valueNavigation?.hasAttribute('enableSearch')).toBe(true);
        });
      });

      describe('is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should enable search for if facetValues length > default minForSearch', () => {
          const valueNavigation = element.renderRoot.querySelector(
            'oryx-search-facet-value-navigation'
          );

          expect(element.minForSearch).toBe(13);
          expect(valueNavigation?.hasAttribute('enableSearch')).toBe(false);
        });
      });
    });

    describe('open', () => {
      describe('is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet
              ?open=${true}
              name="Mock"
            ></oryx-search-facet>`
          );
        });

        it('should open attr for oryx-search-facet-value-navigation', () => {
          const valueNavigation = element.renderRoot.querySelector(
            'oryx-search-facet-value-navigation'
          );

          expect(valueNavigation?.hasAttribute('open')).toBe(true);
        });
      });

      describe('is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should open attr for oryx-search-facet-value-navigation', () => {
          const valueNavigation = element.renderRoot.querySelector(
            'oryx-search-facet-value-navigation'
          );

          expect(valueNavigation?.hasAttribute('open')).not.toBe(true);
        });
      });
    });
  });

  describe('select event', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet name="Mock"></oryx-search-facet>`
      );
    });

    it('should emit select event', () => {
      const callback = vi.fn();
      const facetValue = element.renderRoot.querySelectorAll(
        'input[type="radio"]'
      )[0] as HTMLInputElement;

      const detail = {
        name: 'Mock',
        value: {
          selected: true,
          value: facetValue.value,
        },
      };

      element.addEventListener(FACET_SELECT_EVENT, callback);

      facetValue.click();

      expect(callback).toHaveBeenCalledWith(
        new CustomEvent(FACET_SELECT_EVENT)
      );
      expect(callback.mock.calls[0][0].detail).toStrictEqual(detail);
    });
  });

  describe('when facet has selected values', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(
        of(generateFacet('Mock', 'parameter', 10, ['Mock']))
      );
      element = await fixture(
        html`<oryx-search-facet name="Mock"></oryx-search-facet>`
      );
    });

    it('should make value navigation dirty', () => {
      expect(element).toContainElement(
        'oryx-search-facet-value-navigation[dirty]'
      );
    });
  });
});
