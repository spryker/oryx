import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, resolve } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { generateFacet, generateValues } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import {
  SearchFacetComponentAttributes,
  FACET_SELECT_EVENT,
} from '@spryker-oryx/search/facet';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { of } from 'rxjs';
import { FacetController } from './facet.controller';

const mockFacet = generateFacet('Mock', 'parameter', 10);
const mockSelected = 'Mock2';
const mockWithSelected = {
  value: mockSelected,
  selected: true,
};

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

@customElement('fake-el')
class FakeElement extends LitElement implements SearchFacetComponentAttributes {
  @property() name = mockFacet.name;
  @property({ type: Number }) renderLimit?: number;

  protected controller = new FacetController(this);
  facet$ = this.controller.getFacet();
  selectedValues$ = this.controller.getSelectedValues();

  protected override render(): TemplateResult {
    return html`<button
      @click=${() => this.controller.dispatchSelectEvent(mockWithSelected)}
    ></button>`;
  }
}

describe('Facet controller', () => {
  let element: FakeElement;
  let service: MockFacetListService;

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: FacetListService,
          useClass: MockFacetListService,
        },
      ],
    });

    service = resolve(FacetListService) as unknown as MockFacetListService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('getFacet', () => {
    describe('without renderLimit attribute', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el></fake-el>`);
      });

      it('should return facet with all values', () => {
        element.facet$.subscribe((facet) => {
          expect(facet).toBe(mockFacet);
        });
      });
    });

    describe('with renderLimit attribute', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el .renderLimit=${3}></fake-el>`);
      });

      it('should return facet with renderLimit values length', () => {
        element.facet$.subscribe((facet) => {
          expect(facet?.values.length).toBe(3);
        });
      });
    });

    describe('search', () => {
      const searchValue = 'Search';

      const triggerSearch = () => {
        (
          element.renderRoot.querySelector('button') as HTMLElement
        ).dispatchEvent(
          new CustomEvent('oryx.search', {
            bubbles: true,
            composed: true,
            detail: { query: searchValue },
          })
        );
      };

      beforeEach(async () => {
        service.getFacet.mockReturnValue(
          of({
            ...mockFacet,
            values: [
              ...(mockFacet.values as FacetValue[]),
              ...generateValues(3, searchValue),
            ],
          })
        );
      });

      describe('only search value', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-el></fake-el>`);
          triggerSearch();
        });

        it('should return facet with filtered values by search value', () => {
          element.facet$.subscribe((facet) => {
            expect(facet?.values.length).toBe(3);

            facet?.values.forEach((value) =>
              expect(value.name).toContain(searchValue)
            );
          });
        });
      });

      describe('with search value and renderLimit', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-el .renderLimit=${2}></fake-el>`);
          triggerSearch();
        });

        it('should return facet with filtered values by search value', () => {
          element.facet$.subscribe((facet) => {
            expect(facet?.values.length).toBe(2);
          });
        });
      });
    });
  });

  describe('getSelectedValues', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(of(mockWithSelected));
      element = await fixture(html`<fake-el></fake-el>`);
    });

    it('should map selected values to facetValue', () => {
      element.selectedValues$.subscribe((values) => {
        values.forEach((value) => expect(typeof value).toBe('object'));
      });
    });
  });

  describe('dispatchSelectEvent', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-el></fake-el>`);
    });

    it('should trigger oryx.select event with parameter and selectedValues', () => {
      const callback = vi.fn();
      const button = element.renderRoot.querySelector(
        'button'
      ) as HTMLButtonElement;

      document.addEventListener(FACET_SELECT_EVENT, callback);
      button.click();

      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][0].detail).toStrictEqual({
        name: 'Mock',
        value: mockWithSelected,
      });
    });
  });
});
