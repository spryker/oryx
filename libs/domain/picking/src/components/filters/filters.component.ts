import { resolve } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import {
  PickingListQualifierSortBy,
  PickingListService,
} from '@spryker-oryx/picking';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { of, switchMap } from 'rxjs';
import { fields } from './filters.model';
import { styles } from './filters.styles';

export class FiltersComponent extends LitElement {
  static styles = styles;

  @property({ type: Boolean, reflect: true }) open = false;

  @query('form')
  protected form?: HTMLFormElement;

  protected defaultValue = 'requestedDeliveryDate.desc';
  protected fieldRenderer = resolve(FormRenderer);
  protected pickingListService = resolve(PickingListService);

  @asyncState()
  protected selectedSortingValue = valueType(
    this.pickingListService.getSortingQualifier().pipe(
      switchMap((quantifier) => {
        if (!quantifier) {
          return of(this.defaultValue);
        }

        return of(
          `${quantifier.sortBy}.${quantifier.sortDesc ? 'desc' : 'asc'}`
        );
      })
    )
  );

  protected onSubmit(e: Event): void {
    e.preventDefault();

    const { sortBy: _sortBy } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );
    const [sortBy, sort] = (_sortBy as string).split('.');

    this.pickingListService.setSortingQualifier({
      sortBy: sortBy as PickingListQualifierSortBy,
      sortDesc: sort !== 'asc',
    });

    this.open = false;
  }

  protected onReset(): void {
    this.pickingListService.setSortingQualifier(null);

    this.open = false;
    this.form?.reset();
  }

  protected onClose(): void {
    this.open = false;
    this.form?.reset();
  }

  protected onApply(): void {
    //For safari 15- and other old browsers
    if (!this.form?.requestSubmit) {
      this.form?.submit();
      return;
    }

    this.form.requestSubmit();
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.open}
        enableCloseButtonInHeader
        enableNavigateBack
        enableFooter
        fullscreen
        @oryx.back=${this.onReset}
        @oryx.close=${this.onClose}
      >
        <oryx-heading slot="heading" as-sm="h2">
          <h4>${i18n('picking.filter.filter-&-sort')}</h4>
        </oryx-heading>

        <oryx-button slot="navigate-back" type="text">
          <button>${i18n('picking.filter.reset')}</button>
        </oryx-button>

        <form @submit=${this.onSubmit}>
          ${this.fieldRenderer.buildForm(fields, {
            sortBy: this.selectedSortingValue ?? this.defaultValue,
          })}
        </form>

        <oryx-button slot="footer">
          <button @click=${() => this.onApply()}>
            ${i18n('picking.filter.apply')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }
}
