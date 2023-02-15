import { resolve } from '@spryker-oryx/di';
import { ProductListSort } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { tap } from 'rxjs/operators';
import { SortingService } from '../../src/services/sorting.service';

@hydratable(['mouseover', 'focus'])
export class SortComponent extends LitElement {
  protected routerService = resolve(RouterService);
  protected sortingService = resolve(SortingService);

  @asyncState()
  protected sortingOptions = valueType(this.sortingService.get());

  @asyncState()
  protected querySortValue = valueType(this.routerService.currentQuery());

  protected override render(): TemplateResult {
    return this.renderSorting(this.sortingOptions);
  }

  protected renderSorting(
    sort: ProductListSort | undefined | null
  ): TemplateResult {
    const hasOptions = !!sort?.sortValues.length;

    return html`
      <oryx-select>
        <select
          @change=${this.sortingNavigation}
          aria-label="${i18n('search.select-sorting')}"
        >
          <option value="" hidden>
            ${i18n('search.select-search-parameter')}
          </option>

          ${when(hasOptions, () =>
            sort?.sortValues.map(
              ({ sortKey, sortName }) =>
                html`<option
                  value="${sortKey}"
                  ?selected="${this.querySortValue?.sort === sortKey}"
                >
                  ${sortName}
                </option>`
            )
          )}
        </select>
      </oryx-select>
    `;
  }

  protected sortingNavigation(e: Event): void {
    this.routerService
      .getUrl('', {
        queryParams: {
          sort: (e.target as HTMLSelectElement).value,
        },
        queryParamsHandling: 'merge',
        ignoreQueryParams: ['page'],
      })
      .pipe(tap((url) => this.routerService.navigate(url)))
      .subscribe();
  }
}
