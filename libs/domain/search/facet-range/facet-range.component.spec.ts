import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { generateRange } from '@spryker-oryx/product/mocks';
import { FacetListService } from '@spryker-oryx/search';
import { InputComponent } from '@spryker-oryx/ui/input';
import { MultiRangeComponent } from '@spryker-oryx/ui/multi-range';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { SearchFacetValueNavigationComponent } from '../facet-value-navigation';
import { SearchRangeFacetComponent } from './facet-range.component';
import { searchRangeFacetComponent } from './facet-range.def';

const name = 'Mock';
const min = 0;
const max = 10;
const mockFacet = generateRange(name, 'parameter', [min, max]);

class MockFacetListService implements Partial<FacetListService> {
  getFacet = vi.fn().mockReturnValue(of(mockFacet));
}

describe('SearchRangeFacetComponent', () => {
  let element: SearchRangeFacetComponent;
  let service: MockFacetListService;

  const getInput = (isMax = false): InputComponent => {
    return element.renderRoot.querySelectorAll('oryx-input')[
      +isMax
    ] as InputComponent;
  };

  const getInputField = (isMax = false): HTMLInputElement => {
    return getInput(isMax).querySelector('input') as HTMLInputElement;
  };

  const getNavigation = (): SearchFacetValueNavigationComponent => {
    return element.renderRoot.querySelector(
      'oryx-search-facet-value-navigation'
    ) as SearchFacetValueNavigationComponent;
  };

  const getRange = (): MultiRangeComponent => {
    return element.renderRoot.querySelector(
      'oryx-multi-range'
    ) as MultiRangeComponent;
  };

  beforeAll(async () => {
    await useComponent(searchRangeFacetComponent);
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
      html`<oryx-search-range-facet name=${name}></oryx-search-range-facet>`
    );

    service = testInjector.inject<MockFacetListService>(FacetListService);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
    vi.clearAllTimers();
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

  it('should render inputs with default labels', async () => {
    expect(getInput().label).toBe('min');
    expect(getInput(true).label).toBe('max');
  });

  it('should render min input field with proper configuration', () => {
    const input = getInputField();
    expect(input.getAttribute('aria-label')).toBe('min');
    expect(input.name).toBe('min');
    expect(input.type).toBe('number');
    expect(input.value).toBe(String(min));
    expect(input.min).toBe(String(min));
    expect(input.max).toBe(String(max - 1));
    expect(input.step).toBe('1');
  });

  it('should render max input field with proper configuration', () => {
    const input = getInputField(true);
    expect(input.getAttribute('aria-label')).toBe('max');
    expect(input.name).toBe('max');
    expect(input.type).toBe('number');
    expect(input.value).toBe(String(max));
    expect(input.min).toBe(String(min + 1));
    expect(input.max).toBe(String(max));
    expect(input.step).toBe('1');
  });

  it('should render the range component with proper configuration', () => {
    const range = getRange();
    expect(range.min).toBe(min);
    expect(range.max).toBe(max);
    expect(range.minValue).toBe(min);
    expect(range.maxValue).toBe(max);
    expect(range.step).toBe(1);
  });

  it('should render divider', () => {
    expect(element).toContainElement('span');
  });

  it('should sync min and max states with facet`s selected values', () => {
    expect(element.min).toBe(mockFacet?.values?.selected?.min);
    expect(element.max).toBe(mockFacet?.values?.selected?.max);
  });

  describe('when facet is not existing', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-search-range-facet
          name="fakeMock"
        ></oryx-search-range-facet>`
      );
    });

    it('should not render the content', () => {
      expect(getNavigation()).toBeNull();
    });
  });

  describe('when labels are specified', () => {
    const labelMin = 'labelMin';
    const labelMax = 'labelMax';

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-range-facet
          name=${name}
          .labelMin=${labelMin}
          .labelMax=${labelMax}
        ></oryx-search-range-facet>`
      );
    });

    it('should render correct labels', () => {
      expect(getInput().label).toBe(labelMin);
      expect(getInputField().getAttribute('aria-label')).toBe(labelMin);
      expect(getInput(true).label).toBe(labelMax);
      expect(getInputField(true).getAttribute('aria-label')).toBe(labelMax);
    });
  });

  describe('when range values are changed', () => {
    const callback = vi.fn();
    const selected = { minValue: 1, maxValue: 2 };

    beforeEach(async () => {
      vi.useFakeTimers();
      element = await fixture(
        html`<oryx-search-range-facet
          name=${name}
          @oryx.select=${callback}
        ></oryx-search-range-facet>`
      );

      getRange().dispatchEvent(new CustomEvent('change', { detail: selected }));
      vi.advanceTimersByTime(301);
    });

    it('should sync min and max states with selected values', () => {
      expect(element.min).toBe(selected.minValue);
      expect(element.max).toBe(selected.maxValue);
    });

    it('should dispatch oryx.select event with selected values', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            name,
            value: expect.objectContaining({
              selected: { min: selected.minValue, max: selected.maxValue },
            }),
          }),
        })
      );
    });

    describe('and values are without changes', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        vi.useFakeTimers();

        element = await fixture(
          html`<oryx-search-range-facet
            name=${name}
            @oryx.select=${callback}
          ></oryx-search-range-facet>`
        );

        getRange().dispatchEvent(
          new CustomEvent('change', {
            detail: { minValue: min, maxValue: max },
          })
        );
        vi.advanceTimersByTime(301);
      });

      it('should not dispatch oryx.select', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('min input', () => {
    const value = '2';

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-range-facet name=${name}></oryx-search-range-facet>`
      );

      getInputField().value = value;
      getInputField().focus();
    });

    describe('when input loses focus', () => {
      beforeEach(() => {
        getInputField().blur();
      });

      it('should update the min state', () => {
        expect(element.min).toBe(+value);
      });
    });

    describe('when enter key is pressed', () => {
      beforeEach(() => {
        getInputField().dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Enter' })
        );
      });

      it('should update the min state', () => {
        expect(element.min).toBe(+value);
      });
    });

    describe('max input', () => {
      const value = '5';

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-range-facet name=${name}></oryx-search-range-facet>`
        );

        getInputField(true).value = value;
        getInputField(true).focus();
      });

      describe('when input loses focus', () => {
        beforeEach(() => {
          getInputField(true).blur();
        });

        it('should update the max state', () => {
          expect(element.max).toBe(+value);
        });
      });

      describe('when enter key is pressed', () => {
        beforeEach(() => {
          getInputField(true).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter' })
          );
        });

        it('should update the max state', () => {
          expect(element.max).toBe(+value);
        });
      });
    });
  });

  describe('when facet selected values are not equal to the min and max', () => {
    beforeEach(async () => {
      service.getFacet.mockReturnValue(
        of(generateRange(name, 'parameter', [0, 10], [1, 2]))
      );
      element = await fixture(
        html`<oryx-search-range-facet name=${name}></oryx-search-range-facet>`
      );
    });

    it('should make value navigation dirty', () => {
      expect(getNavigation().hasAttribute('dirty')).toBe(true);
    });
  });
});
