import { resolve } from '@spryker-oryx/di';
import { Facet, FacetValue } from '@spryker-oryx/product';
import { FacetListService } from '@spryker-oryx/search';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
  ShowFacet,
} from '@spryker-oryx/search/facet-value-navigation';
import { ObserveController } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import {
  BehaviorSubject,
  combineLatest,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  FacetComponentAttributes,
  FacetSelect,
  FACET_SELECT_EVENT,
  SingleMultiFacet,
} from '../facet.model';

export class FacetController implements ReactiveController {
  protected observe: ObserveController<LitElement & FacetComponentAttributes>;
  protected facetListService = resolve(FacetListService);
  protected facet$: Observable<Facet | null>;
  protected showAll$ = new BehaviorSubject(false);
  protected searchedValue$ = new BehaviorSubject('');

  constructor(protected host: LitElement & FacetComponentAttributes) {
    this.host.addController(this);
    this.observe = new ObserveController(host);
    this.facet$ = this.observe.get('name').pipe(
      switchMap((name) =>
        name
          ? (this.facetListService.getFacet({
              name,
            }) as Observable<SingleMultiFacet>)
          : of(null)
      )
    );

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
  getFacet(): Observable<SingleMultiFacet | null> {
    return this.facet$.pipe(
      mergeMap((facet) =>
        iif(
          () => facet !== null && Array.isArray(facet.values),
          of(facet as SingleMultiFacet).pipe(
            switchMap((facet) =>
              this.searchedValue$.pipe(
                map((searchedValue) =>
                  this.filterFacetValues(facet, searchedValue)
                )
              )
            ),
            switchMap((facet) =>
              combineLatest([
                this.observe.get('renderLimit'),
                this.showAll$,
              ]).pipe(
                map(([limit, showAll]) =>
                  this.cutByRenderLimit(facet, showAll ? Infinity : limit)
                )
              )
            )
          ),
          of(null)
        )
      )
    );
  }

  /**
   * Returns an array with all selected facet values
   */
  getSelectedValues(): Observable<FacetValue[]> {
    return this.getFacet().pipe(
      map((facet) =>
        facet && Array.isArray(facet.selectedValues)
          ? facet.selectedValues.map(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (selVal) => facet.values.find((val) => val.name === selVal)!
            )
          : ([] as FacetValue[])
      )
    );
  }

  /**
   * Dispatch the selected facet value.
   */
  dispatchSelectEvent(value?: Pick<FacetValue, 'value' | 'selected'>): void {
    const name = this.host.name;
    if (name) {
      this.host.dispatchEvent(
        new CustomEvent<FacetSelect>(FACET_SELECT_EVENT, {
          detail: { name, value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // ToDo: This is temporary filtering implementation.
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
    if (facet.values.length < renderLimit) {
      return facet;
    }

    return {
      ...facet,
      ...(renderLimit && {
        values: [...facet.values].splice(0, renderLimit),
      }),
    };
  }

  protected onToggle(e: Event): void {
    this.showAll$.next((e as CustomEvent<ShowFacet>).detail.isShowed);
  }

  protected onSearch(e: Event): void {
    this.searchedValue$.next(
      (e as CustomEvent<{ query: string }>).detail.query
    );
  }

  protected onClearSearch(): void {
    this.searchedValue$.next('');
  }

  protected onClear(): void {
    this.dispatchSelectEvent();
    this.deselectInputs();
  }

  private deselectInputs() {
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
