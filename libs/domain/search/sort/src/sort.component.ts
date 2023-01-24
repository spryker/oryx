import { resolve } from '@spryker-oryx/di';
import { ProductListSort } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { asyncValue, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { tap } from 'rxjs/operators';
import { SortingService } from '../../src/services/sorting.service';

export class SortComponent extends LitElement {
  protected routerService = resolve(RouterService);
  protected sortingService = resolve(SortingService);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.sortingService.get(), (sort) => {
        return this.renderSorting(sort);
      })}
    `;
  }

  protected renderSorting(sort: ProductListSort | null): TemplateResult {
    return html`
      <oryx-select>
        <select
          @change=${this.sortingNavigation}
          aria-label="${i18n('search.select-sorting')}"
        >
          <option value hidden>
            ${i18n('search.select-search-parameter')}
          </option>
          ${(sort?.sortValues ?? []).map(
            ({ sortKey, sortName }) =>
              html`<option value="${sortKey}">${sortName}</option>`
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
      })
      .pipe(tap((url) => this.routerService.navigate(url)))
      .subscribe();
  }
}
