import { resolve } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import {
  defaultQualifier,
  PickingListQualifierSortBy,
  PickingListService,
  SortableQualifier,
} from '@spryker-oryx/picking/services';
import { ButtonColor, ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { featureVersion, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { map } from 'rxjs';
import { getFilterFields } from './filters.model';
import { filtersComponentStyles } from './filters.styles';

export class PickingFiltersComponent extends I18nMixin(LitElement) {
  static styles = filtersComponentStyles;

  @property({ type: Boolean, reflect: true }) open = false;

  @query('form')
  protected form?: HTMLFormElement;

  protected fieldRenderer = resolve(FormRenderer);
  protected pickingListService = resolve(PickingListService);

  protected $selectedSortingValue = signal(
    this.pickingListService.getQualifier().pipe(map(this.formatValue)),
    { initialValue: this.formatValue(defaultQualifier) }
  );

  protected formatValue(
    quantifier: SortableQualifier<PickingListQualifierSortBy>
  ): string {
    return `${quantifier.sortBy}.${quantifier.sortDesc ? 'desc' : 'asc'}`;
  }

  protected onSubmit(e: Event): void {
    e.preventDefault();

    const { sortBy: _sortBy } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );
    const [sortBy, sort] = (_sortBy as string).split('.');

    this.pickingListService.setQualifier({
      sortBy: sortBy as PickingListQualifierSortBy,
      sortDesc: sort !== 'asc',
    });

    this.open = false;
  }

  protected onReset(): void {
    this.pickingListService.setQualifier(defaultQualifier);

    this.onClose();
  }

  protected onClose(): void {
    this.open = false;
    this.form?.reset();
  }

  protected onApply(event: Event): void {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') return;
    event.preventDefault();

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
        @oryx.back=${this.onReset}
        @oryx.modal.back=${this.onReset}
        @oryx.close=${this.onClose}
        @oryx.modal.closed=${this.onClose}
      >
        ${this.__renderHeading()}

        <oryx-button
          slot="navigate-back"
          .color=${ButtonColor.Primary}
          .type=${ButtonType.Text}
          .text=${this.i18n('picking.filter.reset')}
        ></oryx-button>

        <form @submit=${this.onSubmit} @keydown=${this.onApply}>
          ${this.fieldRenderer.buildForm(getFilterFields(), {
            sortBy: this.$selectedSortingValue(),
          })}
        </form>

        <oryx-button
          slot="footer"
          .text=${this.i18n('picking.filter.apply')}
          @click=${this.onApply}
        ></oryx-button>
      </oryx-modal>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    const text = this.i18n('picking.filter.sort');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading
        slot="heading"
        .tag=${HeadingTag.H4}
        .sm=${HeadingTag.H2}
      >
        ${text}
      </oryx-heading>`;
    } else {
      return html`<oryx-heading slot="heading" sm="h2">
        <h4>${text}</h4>
      </oryx-heading>`;
    }
  }
}
