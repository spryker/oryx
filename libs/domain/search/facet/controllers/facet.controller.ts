import { resolve } from '@spryker-oryx/di';
import {
  FacetType,
  FacetValue,
  RangeFacet,
  RangeFacetValue,
} from '@spryker-oryx/product';
import {
  FacetListService,
  SelectFacetEventDetail,
  SelectFacetEventDetailValue,
  SingleMultiFacet,
} from '@spryker-oryx/search';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
  ToggleFacetEventDetail,
} from '@spryker-oryx/search/facet-value-navigation';
import { SearchEventDetail } from '@spryker-oryx/ui/searchbox';
import { ObserveController, computed, signal } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { defer, of, switchMap } from 'rxjs';
import {
  FACET_SELECT_EVENT,
  SearchFacetComponentAttributes,
} from '../facet.model';

export class FacetController implements ReactiveController {
  protected observe: ObserveController<
    LitElement & SearchFacetComponentAttributes
  >;

  protected facetListService = resolve(FacetListService);

  protected $facet = signal(
    defer(() =>
      this.observe
        .get('name')
        .pipe(
          switchMap((name) =>
            name ? this.facetListService.getFacet({ name }) : of(null)
          )
        )
    )
  );

  protected $showAll = signal(false);
  protected $searchedValue = signal('');
  protected $renderLimit = signal(defer(() => this.observe.get('renderLimit')));

  protected computedFacet = computed(() => {
    const facet = this.$facet();

    if (facet?.type === FacetType.Single || facet?.type === FacetType.Multi) {
      const search = this.$searchedValue();
      const renderLimit = this.$renderLimit();
      const showAll = this.$showAll();
      const filteredValues = this.filterFacetValues(
        facet as SingleMultiFacet,
        search
      );
      const limitedValues = this.cutByRenderLimit(
        filteredValues,
        showAll ? Infinity : renderLimit
      );
      return limitedValues;
    } else if (facet?.type === FacetType.Range) {
      return facet;
    }

    return null;
  });

  protected selectedValues = computed(() => {
    const facet = this.$facet();

    if (!facet) return [];

    if (facet.type === FacetType.Range) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return facet.values.selected!;
    }

    return facet.values.filter(({ name }) =>
      (facet.selectedValues ?? []).includes(name as string)
    );
  });

  /**
   * Returns modified data based on searching and cutting by renderLimit.
   */
  getFacet<
    T extends SingleMultiFacet | RangeFacet = SingleMultiFacet
  >(): T | null {
    return this.computedFacet() as T;
  }

  /**
   * Returns an array with all selected facet values
   */
  getSelectedValues(): FacetValue[] | RangeFacetValue {
    return this.selectedValues();
  }

  /**
   * Dispatch the selected facet value.
   */
  dispatchSelectEvent(value?: SelectFacetEventDetailValue): void {
    const name = this.host.name;
    if (name) {
      this.host.dispatchEvent(
        new CustomEvent<SelectFacetEventDetail>(FACET_SELECT_EVENT, {
          detail: { name, value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // ToDo: This is temporary filtering implementation.
  // need to rethink the logic of this method.
  // The sum of the matches is not calculated correctly and in general
  // the filtering behavior is not intuitive for the end user
  protected filterFacetValues(
    facet: SingleMultiFacet,
    searchedValue: string
  ): SingleMultiFacet {
    if (!searchedValue || !facet?.values?.length) {
      return facet as SingleMultiFacet;
    }

    let filteredValueLength = 0;

    const reducer = (result: FacetValue[], value: FacetValue): FacetValue[] => {
      const name = String(value.name ?? value.value);
      const isIncludes = name
        .trim()
        ?.toLowerCase()
        .includes(searchedValue.trim().toLowerCase());

      if (isIncludes) {
        filteredValueLength++;
        result.push({ ...value });

        return result;
      }

      if (Array.isArray(value.children)) {
        const children = value.children.reduce(reducer, []);

        if (children.length) {
          filteredValueLength += children.length;
          result.push({ ...value, children });
        }
      }

      return result;
    };

    const values = facet.values?.reduce(reducer, []);

    return {
      ...facet,
      filteredValueLength,
      values,
    };
  }

  protected cutByRenderLimit(
    facet: SingleMultiFacet,
    renderLimit = Infinity
  ): SingleMultiFacet {
    if (!renderLimit || facet.values.length < renderLimit) {
      return facet;
    }

    return {
      ...facet,
      values: facet.values.slice(0, renderLimit),
    };
  }

  protected onToggle(e: Event): void {
    this.$showAll.set(
      (e as CustomEvent<ToggleFacetEventDetail>).detail.expanded
    );
  }

  protected onSearch(e: Event): void {
    this.$searchedValue.set((e as CustomEvent<SearchEventDetail>).detail.query);
  }

  protected onClearSearch(): void {
    this.$searchedValue.set('');
  }

  protected onClear(): void {
    this.onClearSearch();
    this.dispatchSelectEvent();
    this.deselectInputs();
  }

  protected deselectInputs(): void {
    const inputs =
      this.host.renderRoot.querySelectorAll<HTMLInputElement>('input:checked');

    inputs.forEach((input) => {
      input.checked = false;
      input.dispatchEvent(
        new InputEvent('input', { bubbles: true, composed: true })
      );
    });
  }

  constructor(protected host: LitElement & SearchFacetComponentAttributes) {
    this.host.addController(this);
    this.observe = new ObserveController(host);

    this.onSearch = this.onSearch.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  hostConnected(): void {
    this.host.addEventListener('oryx.search', this.onSearch);
    this.host.addEventListener('change', this.onClearSearch);
    this.host.addEventListener(FACET_TOGGLE_EVENT, this.onToggle);
    this.host.addEventListener(FACET_CLEAR_EVENT, this.onClear);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('oryx.search', this.onSearch);
    this.host.addEventListener('change', this.onClearSearch);
    this.host.removeEventListener(FACET_TOGGLE_EVENT, this.onToggle);
    this.host.removeEventListener(FACET_CLEAR_EVENT, this.onClear);
  }
}
