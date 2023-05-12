import { resolve } from '@spryker-oryx/di';
import {
  defaultSortingQualifier,
  PickingListQualifierSortBy,
  PickingListService,
  SortableQualifier,
} from '@spryker-oryx/picking';
import { effect, i18n, signal, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { map } from 'rxjs';

export class FilterButtonComponent extends LitElement {
  @query('oryx-picking-filters') protected filters?: HTMLElement;
  @query('input') protected input?: HTMLInputElement;

  protected $selectedFilters = signal(
    resolve(PickingListService)
      .getSortingQualifier()
      .pipe(map(this.hasSelectedFilter))
  );
  protected selectedFiltersEffect = effect(() => {
    const checked = !!this.$selectedFilters();
    if (this.input) {
      this.input.checked = checked;
    }
  });

  protected override render(): TemplateResult {
    return html`
      <oryx-toggle-icon size=${Size.Sm}>
        <input
          type="checkbox"
          placeholder=${i18n('picking.filter.toggle-filters')}
          @click=${(e: Event) => this.onClick(e)}
        />
        <oryx-icon type="filter"></oryx-icon>
        <span>${i18n('picking.filter.sort')}</span>
      </oryx-toggle-icon>

      <oryx-picking-filters></oryx-picking-filters>
    `;
  }

  protected onClick(e: Event): void {
    e.preventDefault();

    this.filters?.toggleAttribute('open');
  }

  protected hasSelectedFilter(
    selectedFilters: SortableQualifier<PickingListQualifierSortBy>
  ): boolean {
    return (
      selectedFilters.sortBy !== defaultSortingQualifier.sortBy ||
      selectedFilters.sortDesc !== defaultSortingQualifier.sortDesc
    );
  }
}
