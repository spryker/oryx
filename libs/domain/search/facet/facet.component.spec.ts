import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { generateFacet } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SearchFacetComponent } from './facet.component';
import { searchFacetComponent } from './facet.def';
import { FACET_SELECT_EVENT } from './facet.model';
import {FacetValue} from "@spryker-oryx/product";

const selectedValuesNames = ['Mock8']
const disabledValuesNames = ['Mock9']
const mockFacet = generateFacet('Mock', 'parameter', 10, selectedValuesNames, disabledValuesNames)

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('SearchFacetComponent', () => {
  let element: SearchFacetComponent;

  beforeAll(async () => {
    await useComponent(searchFacetComponent);
  });

  let facetListService: MockFacetListService

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
      ],
    });

    facetListService = injector.inject(FacetListService) as unknown as MockFacetListService
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

    describe('enableClear', () => {
      describe('is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet
              .enableClear=${false}
              name="Mock"
            ></oryx-search-facet>`
          );
        });

        it('should not provide "enableClear" attribute to oryx-search-facet-value-navigation', () => {
          const valueNavigation = element.renderRoot.querySelector(
            'oryx-search-facet-value-navigation'
          );

          expect(valueNavigation?.hasAttribute('enableClear')).toBe(false);
        })
      });

      describe('is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search-facet name="Mock"></oryx-search-facet>`
          );
        });

        it('should provide "enableClear" attribute to oryx-search-facet-value-navigation', () => {
          const valueNavigation = element.renderRoot.querySelector(
            'oryx-search-facet-value-navigation'
          );

          expect(valueNavigation?.hasAttribute('enableClear')).toBe(true);
        })
      });
    })
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


  describe('facet values', () => {
    let listItems: NodeListOf<HTMLLIElement>

    beforeEach(async () => {
      element = await fixture(
        html`
          <oryx-search-facet
            name="Mock"
            .renderLimit="${(mockFacet.values as FacetValue[]).length}"
          ></oryx-search-facet>`
      );

      listItems = element.renderRoot.querySelectorAll('li');
    })

    it('should render input value', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        expect(listItems[index].querySelector('input')?.value).toBe(value.value)
      })
    })

    it('should render the count number for facet values which count property is greater than 0', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        if (value.count) {
          expect(listItems[index].querySelectorAll('input + div span').length).toBe(2)
          expect(listItems[index].querySelector('input + div span:last-child')?.textContent).toContain(value.count)
        } else {
          expect(listItems[index].querySelectorAll('input + div span').length).toBe(1)
        }
      });
    })

    it('should render disabled facet value', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        if (value.disabled) {
          expect(listItems[index].querySelector('input')?.hasAttribute('disabled')).toBe(true)
        } else {
          expect(listItems[index].querySelector('input')?.hasAttribute('disabled')).toBe(false)
        }
      })

    })

    it('should render disabled facet value', () => {
      selectedValuesNames.forEach((valueName) => {
        expect(element.renderRoot.querySelector(`input[value="${valueName}"]`)?.hasAttribute('checked')).toBe(true)
      })
    })

    it('should not render children facet values', () => {
      expect(element.renderRoot.querySelectorAll('li li').length).toBe(0)
    })

    it('should reneder facet value label', () => {
      (mockFacet.values as FacetValue[]).forEach((value, index) => {
        expect(listItems[index].querySelector('input + div span')?.textContent).toContain(value.name)
      })
    })
  })

  describe('when facet values have children', () => {
    beforeEach(async () => {
      facetListService.getFacet = vi.fn().mockReturnValue(of(generateFacet('Mock', 'parameter', 10, selectedValuesNames, disabledValuesNames, true)))

      element = await fixture(
        html`
          <oryx-search-facet
            name="Mock"
            .renderLimit="${(mockFacet.values as FacetValue[]).length}"
          ></oryx-search-facet>`
      );
    })

    it('should render children facet values', async () => {
      expect(element.renderRoot.querySelectorAll('li li').length).toBe(30)
    })
  })
});
