import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { generateFacet } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { SearchFacetValueNavigationComponent } from '@spryker-oryx/search/facet-value-navigation';
import { featureVersion, i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchFacetComponent } from './facet.component';
import { searchFacetComponent } from './facet.def';
import { FACET_SELECT_EVENT } from './facet.model';

const selectedValuesNames = ['Mock8'];
const mockFacet = generateFacet('Mock', 'parameter', 10, selectedValuesNames);

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

    element = await fixture(
      html`<oryx-search-facet name="Mock"></oryx-search-facet>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SearchFacetComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should provide "valuesLength" attribute to oryx-search-facet-value-navigation', () => {
    const valueNavigation =
      element.renderRoot.querySelector<SearchFacetValueNavigationComponent>(
        'oryx-search-facet-value-navigation'
      );

    expect(valueNavigation?.valuesLength).toBe(10);
  });

  it('should provide "selectedLength" attribute to oryx-search-facet-value-navigation', () => {
    const valueNavigation =
      element.renderRoot.querySelector<SearchFacetValueNavigationComponent>(
        'oryx-search-facet-value-navigation'
      );

    expect(valueNavigation?.selectedLength).toBe(selectedValuesNames.length);
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

        it('should provide name attribute to oryx-search-facet-value-navigation', () => {
          const valueNavigation =
            element.renderRoot.querySelector<SearchFacetValueNavigationComponent>(
              'oryx-search-facet-value-navigation'
            );

          expect(valueNavigation?.heading).toBe('Mock');
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

    if (featureVersion >= '1.2') {
      describe('disableClear', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should provide "enableClear" attribute to oryx-search-facet-value-navigation', () => {
          expect(element).toContainElement(
            'oryx-search-facet-value-navigation[enableClear]'
          );
        });

        describe('and clear disabled', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search-facet
                name="Mock"
                disableClear
              ></oryx-search-facet>`
            );
          });

          it('should disable clear on value navigation', () => {
            expect(element).toContainElement(
              'oryx-search-facet-value-navigation:not([enableClear])'
            );
          });
        });
      });
    } else {
      describe('enableClear', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should enable clear on value navigation', () => {
          expect(element).toContainElement(
            'oryx-search-facet-value-navigation[enableClear]'
          );
        });

        describe('and disabled', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search-facet
                name="Mock"
                .enableClear=${false}
              ></oryx-search-facet>`
            );
          });

          it('should disable clear on value navigation', () => {
            expect(element).toContainElement(
              'oryx-search-facet-value-navigation:not([enableClear])'
            );
          });
        });
      });
    }
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

  describe('facet values', () => {
    let listItems: NodeListOf<HTMLLIElement>;

    beforeEach(async () => {
      element = await fixture(
        html` <oryx-search-facet
          name="Mock"
          .renderLimit="${(mockFacet.values as FacetValue[]).length}"
        ></oryx-search-facet>`
      );

      listItems = element.renderRoot.querySelectorAll('li');
    });

    it('should render input value', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        expect(listItems[index].querySelector('input')?.value).toBe(
          value.value
        );
      });
    });

    it('should render the label', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        expect(
          listItems[index].querySelector('input + div span')?.textContent
        ).toContain(value.name);
      });
    });

    it('should render the count number for facet values which count property is greater than 0', () => {
      const values = (mockFacet.values as FacetValue[]).filter(
        (val) => val.count > 0
      );

      const facetOptionsWithCounter = Array.from(listItems).filter(
        (item) =>
          item.querySelectorAll('input + div span').length === 2 &&
          item.querySelector('input + div span:last-child')?.textContent
      );

      expect(values.length).toBe(facetOptionsWithCounter.length);

      values.forEach((value) => {
        expect(
          element.renderRoot.querySelector(
            `input[value="${value.name}"] + div span:last-child`
          )?.textContent
        ).toContain(value.count);
      });
    });

    it('should render checked facet value', () => {
      selectedValuesNames.forEach((valueName) => {
        expect(element).toContainElement(
          `input[value="${valueName}"][checked]`
        );
      });
    });

    it('should not render children facet values', () => {
      expect(element).not.toContainElement('li li');
    });

    it('should render facet value label', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        expect(
          listItems[index].querySelector('input + div span')?.textContent
        ).toContain(value.name);
      });
    });
  });

  describe('when facet values have children', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(
        of(generateFacet('Mock', 'parameter', 10, selectedValuesNames, true))
      );

      element = await fixture(
        html` <oryx-search-facet
          name="Mock"
          .renderLimit="${(mockFacet.values as FacetValue[]).length}"
        ></oryx-search-facet>`
      );
    });

    it('should render children facet values', () => {
      expect(element.renderRoot.querySelectorAll('li li').length).toBe(30);
    });
  });

  describe('when facet has no values', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(
        of(generateFacet('Mock', 'parameter', 0))
      );

      element = await fixture(
        html` <oryx-search-facet name="Mock"></oryx-search-facet>`
      );
    });

    it('should not render facet values', () => {
      expect(element).not.toContainElement('li');
    });

    it('should render fallback message', () => {
      const valueNavigation =
        element.renderRoot.querySelector<SearchFacetValueNavigationComponent>(
          'oryx-search-facet-value-navigation'
        );

      expect(valueNavigation?.textContent).toContain(
        i18n('search.facet.no-results-found')
      );
    });
  });
});
