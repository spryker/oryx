import { resolve } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { i18n, Size, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { tap } from 'rxjs';

export class FilterButtonComponent extends LitElement {
  @query('oryx-picking-filters') protected filters?: HTMLElement;
  @query('input') protected input?: HTMLInputElement;

  @subscribe()
  protected selectedFilter = resolve(PickingListService)
    .getSortingQualifier()
    .pipe(
      tap((sortingQualifier) => {
        if (!this.input) return;
        this.input.checked = !!sortingQualifier;
      })
    );

  protected onClick(e: Event): void {
    e.preventDefault();

    this.filters?.toggleAttribute('open');
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-toggle-icon size=${Size.Sm}>
        <input
          type="checkbox"
          placeholder="toggle filters"
          @click=${(e: Event) => this.onClick(e)}
        />
        <oryx-icon type="filter"></oryx-icon>
        <span>${i18n('picking.filter.sort')}</span>
      </oryx-toggle-icon>

      <oryx-picking-filters></oryx-picking-filters>
    `;
  }
}
