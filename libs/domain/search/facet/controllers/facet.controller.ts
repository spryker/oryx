import { resolve } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { FacetListService } from '@spryker-oryx/search';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
  ToggleFacetPayload,
} from '@spryker-oryx/search/facet-value-navigation';
import { ObserveController, computed, signal } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import {
  BehaviorSubject,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  SearchFacetComponentAttributes,
  SelectFacetPayload,
  FACET_SELECT_EVENT,
  SingleMultiFacet,
} from '../facet.model';
import { SearchPayload } from '@spryker-oryx/ui/searchbox';

export class FacetController implements ReactiveController {
  protected observe = new ObserveController(this.host);
  protected facetListService = resolve(FacetListService);

  protected facet$ = this.observe.get('name').pipe(
    switchMap((name) =>
      name
        ? (this.facetListService.getFacet({
            name,
          }) as Observable<SingleMultiFacet>)
        : of(null)
    )
  )

  protected showAll$ = new BehaviorSubject(false);
  protected searchedValue$ = new BehaviorSubject('');

  protected $facet = signal<SingleMultiFacet | null>(this.facet$);
  protected $showAll = signal(false);
  protected $searchedValue = signal('');
  protected $renderLimit = signal(this.observe.get('renderLimit'));

  protected computedFacet = computed(() => {
    const facet = this.$facet();
    const query = this.$searchedValue();
    const renderLimit = this.$renderLimit();
    const showAll = this.$showAll();

    if (facet && Array.isArray(facet.values)) {
      const filteredValues = this.filterFacetValues(facet, query);
      const limitedValues = this.cutByRenderLimit(filteredValues, showAll ? Infinity : renderLimit);
      return limitedValues;
    }

    return null;
  });

  protected selectedValues = computed(() => {
    const facet = this.$facet();

    return facet ? 
      facet.values.filter(({name}) => (facet.selectedValues ?? []).includes(name as string)):
      [];
  });

  constructor(protected host: LitElement & SearchFacetComponentAttributes) {
    this.host.addController(this);
   
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

  /**
   * Returns modified data based on searching and cutting by renderLimit.
   */
  getFacet(): SingleMultiFacet | null {
    return this.computedFacet();
  }

  /**
   * Returns an array with all selected facet values
   */
  getSelectedValues(): FacetValue[] {
    return this.selectedValues();
  }

  /**
   * Dispatch the selected facet value.
   */
  dispatchSelectEvent(value?: Pick<FacetValue, 'value' | 'selected'>): void {
    const name = this.host.name;
    if (name) {
      this.host.dispatchEvent(
        new CustomEvent<SelectFacetPayload>(FACET_SELECT_EVENT, {
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
        console.log(filteredValueLength, name, 'inc');
        result.push({ ...value });

        return result;
      }

      if (Array.isArray(value.children)) {
        const children = value.children.reduce(reducer, []);

        if (children.length) {

          filteredValueLength += children.length;
          console.log(filteredValueLength, name, 'chi');
          result.push({ ...value, children });
        }
      }

      return result;
    };

    const values = facet.values?.reduce(reducer, []);

    console.log(values, filteredValueLength);
    

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
      (e as CustomEvent<ToggleFacetPayload>).detail.expanded
    )
  }

  protected onSearch(e: Event): void {
    this.$searchedValue.set(
      (e as CustomEvent<SearchPayload>).detail.query
    )
  }

  protected onClearSearch(): void {
    this.$searchedValue.set('')
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
}
