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
import { computed } from '@spryker-oryx/utilities';

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
  @property({reflect: true}) name = mockFacet.name;
  @property({ type: Number }) renderLimit?: number;

  protected controller = new FacetController(this);
  facet = computed(() => this.controller.getFacet());
  selectedValues$ = computed(() => this.controller.getSelectedValues());

  protected override render(): TemplateResult {
    return html`<button
      @click=${() => this.controller.dispatchSelectEvent(mockWithSelected)}
    ></button>`;
  }
}

describe('FacetController', () => {
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
    describe('when amount of rendered elements is not limited', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el></fake-el>`);
      });

      it('should return facet with all values', () => {
        expect(element.facet()).toBe(mockFacet);
      });
    });

    describe('when renderLimit is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el .renderLimit=${3}></fake-el>`);
      });

      it('should return facet with renderLimit values length', () => {
        expect(element.facet()?.values.length).toBe(3);
      });
    });
  });

  describe('when facet values filtered by name', () => {
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

    describe('when search is performed', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el></fake-el>`);
        triggerSearch();
      });

      it('should return facet with filtered values', () => {
        const facet = element.facet();

        expect(facet?.values.length).toBe(3);
        facet?.values.forEach((value) =>
          expect(value.name).toContain(searchValue)
        );
      });

      describe('and renderLimit is provided', () => {
        const renderLimit = 2;
        beforeEach(async () => {
          element = await fixture(html`<fake-el .renderLimit=${renderLimit}></fake-el>`);
          triggerSearch();
        });

        it('should return limited facet with filtered values', () => {
          expect(element.facet()?.values.length).toBe(renderLimit);
        });
      });
    });
  });

  // describe('getSelectedValues', () => {

  //   beforeEach(async () => {
  //     service.getFacet.mockReturnValue(
  //       of({
  //         ...mockFacet,
  //         values: [
  //           ...(mockFacet.values as FacetValue[]),
  //           ...generateValues(3, searchValue),
  //         ],
  //       })
  //     );
  //   });

  //   beforeEach(async () => {
  //     service.getFacet.mockReturnValue(of(mockWithSelected));
  //     element = await fixture(html`<fake-el></fake-el>`);
  //   });

  //   it('should map selected values to facetValue', () => {
  //     element.selectedValues$.subscribe((values) => {
  //       values.forEach((value) => expect(typeof value).toBe('object'));
  //     });
  //   });
  // });

  describe('dispatchSelectEvent', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(html`<fake-el
        @oryx.select=${callback}
      ></fake-el>`);

      element.renderRoot.querySelector(
        'button'
      )?.dispatchEvent(
        new MouseEvent('click')
      )
    });

    it('should trigger oryx.select event with parameter and selectedValues', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            name: 'Mock',
            value: mockWithSelected,
          })
        })
      );
    });
  });
});
