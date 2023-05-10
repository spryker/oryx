import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './filters.styles';
import { property, query } from 'lit/decorators.js';
import { fields, SUBMIT_EVENT } from './filters.model';
import { resolve } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';

export class FiltersComponent extends LitElement {
  static styles = styles;

  protected fieldRenderer = resolve(FormRenderer);

  @property({type: Boolean}) open = false;

  @query('form')
  protected form?: HTMLFormElement;

  protected onSubmit(e: Event): void {
    e.preventDefault();

    const values = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );

    this.dispatchEvent(
      new CustomEvent(SUBMIT_EVENT, {
        composed: true,
        bubbles: true,
        detail: { values },
      })
    );
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
      >
        <oryx-heading slot="heading" as-sm="h2">
          <h4>${i18n('picking.filter.filter-&-sort')}</h4>
        </oryx-heading>

        <oryx-button slot="navigate-back" type="text">
          <button>${i18n('picking.filter.reset')}</button>
        </oryx-button>

        <form @submit=${this.onSubmit}>
          ${this.fieldRenderer.buildForm(fields, {sortBy: '1'})}
        </form>

        <oryx-button slot="footer">
          <button @click=${() => this.onApply()}>${i18n('picking.filter.apply')}</button>
        </oryx-button>
      </oryx-modal>
    `;
  }
}
