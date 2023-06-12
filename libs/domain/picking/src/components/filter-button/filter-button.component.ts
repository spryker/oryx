import { resolve } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n, signal, signalAware, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { map, tap } from 'rxjs';
import {
  defaultSortingQualifier,
  PickingListQualifierSortBy,
  SortableQualifier,
} from '../../models';
import { PickingListService } from '../../services';

@signalAware()
export class FilterButtonComponent extends LitElement {
  @query('oryx-picking-filters') protected filters?: HTMLElement;
  @query('input') protected input?: HTMLInputElement;

  protected $selectedFilters = signal(
    resolve(PickingListService)
      .getSortingQualifier()
      .pipe(
        map(this.hasSelectedFilter),
        tap((hasSelected) => {
          if (this.input) {
            this.input.checked = hasSelected;
          }
        })
      )
  );

  protected override render(): TemplateResult {
    return html`
      <oryx-toggle-icon size=${Size.Sm}>
        <input
          type="checkbox"
          placeholder=${i18n('picking.filter.toggle-filters')}
          ?checked=${this.$selectedFilters()}
          @click=${(e: Event) => this.onClick(e)}
        />
        <oryx-icon .type=${IconTypes.Filter}></oryx-icon>
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
