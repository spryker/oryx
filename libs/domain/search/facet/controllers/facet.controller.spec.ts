import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, resolve } from '@spryker-oryx/di';
import { FacetValue, ValueFacet } from '@spryker-oryx/product';
import { generateFacet, generateValues } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
} from '@spryker-oryx/search/facet-value-navigation';
import { computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { of } from 'rxjs';
import { FacetController } from './facet.controller';

const valuesLength = 10;
const mockFacet = generateFacet('Mock', 'parameter', valuesLength);
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
  @property({ reflect: true }) name = mockFacet.name;
  @property({ type: Number }) renderLimit?: number;

  protected controller = new FacetController(this);
  facet = computed(() => this.controller.getFacet() as ValueFacet);
  selectedValues = computed(() => this.controller.getSelectedValues());

  protected override render(): TemplateResult {
    return html`<button
        @click=${() => this.controller.dispatchSelectEvent(mockWithSelected)}
      ></button>
      <input type="checkbox" /> `;
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

    describe('and toggle event is dispatched', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el .renderLimit=${3}></fake-el>`);
        element.dispatchEvent(
          new CustomEvent(FACET_TOGGLE_EVENT, { detail: { expanded: true } })
        );
      });

      it('should not limit the values', () => {
        expect(element.facet()?.values.length).toBe(valuesLength);
      });
    });
  });

  describe('when facet values filtered by name', () => {
    const searchValue = 'Search';
    let valuesLength: number;

    const triggerSearch = () => {
      (element.renderRoot.querySelector('button') as HTMLElement).dispatchEvent(
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

    describe('and search is performed', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-el></fake-el>`);
        valuesLength = element.facet()!.values.length;
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
          element = await fixture(
            html`<fake-el .renderLimit=${renderLimit}></fake-el>`
          );
          triggerSearch();
        });

        it('should return limited facet with filtered values', () => {
          expect(element.facet()?.values.length).toBe(renderLimit);
        });
      });

      describe('and search is cleared', () => {
        beforeEach(async () => {
          element.dispatchEvent(new Event('change'));
        });

        it('should not filter the values', () => {
          expect(element.facet()?.values.length).toBe(valuesLength);
        });
      });
    });
  });

  describe('when selected values are got', () => {
    describe('and there is no facet', () => {
      beforeEach(async () => {
        service.getFacet.mockReturnValue(of(null));
        element = await fixture(html`<fake-el></fake-el>`);
      });

      it('should return empty result', () => {
        expect(element.selectedValues()).toEqual([]);
      });
    });

    describe('and facet has no selectedValues', () => {
      beforeEach(async () => {
        service.getFacet.mockReturnValue(of(mockFacet));
        element = await fixture(html`<fake-el></fake-el>`);
      });

      it('should return empty result', () => {
        expect(element.selectedValues()).toEqual([]);
      });
    });

    describe('and facet has selectedValues', () => {
      const value = (mockFacet.values as FacetValue[])[0];
      beforeEach(async () => {
        service.getFacet.mockReturnValue(
          of({
            ...mockFacet,
            selectedValues: [value.name],
          })
        );
        element = await fixture(html`<fake-el></fake-el>`);
      });

      it('should return selected facet value', () => {
        expect(element.selectedValues()).toEqual([value]);
      });
    });
  });

  describe('when select event is dispatched', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(html`<fake-el
        @oryx.select=${callback}
      ></fake-el>`);

      element.renderRoot
        .querySelector('button')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should trigger oryx.select event with parameter and selectedValues', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            name: 'Mock',
            value: mockWithSelected,
          }),
        })
      );
    });
  });

  describe('when facet is cleared', () => {
    const callback = vi.fn();
    const inputCallback = vi.fn();
    let input: HTMLInputElement;

    beforeEach(async () => {
      element = await fixture(html`<fake-el
        @oryx.select=${callback}
        @input=${inputCallback}
      ></fake-el>`);
      input = element.renderRoot.querySelector<HTMLInputElement>('input')!;
      input.checked = true;
      element.dispatchEvent(new CustomEvent(FACET_CLEAR_EVENT));
    });

    it('should dispatch the select event', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            name: 'Mock',
          }),
        })
      );
    });

    it('should deselect the inputs and dispatches input events', () => {
      expect(input.checked).toBe(false);
      expect(inputCallback).toHaveBeenCalled();
    });
  });
});
