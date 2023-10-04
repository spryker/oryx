import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { BACK_EVENT, CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { discardModalStyles } from './discard-modal.styles';

export class PickingDiscardModalComponent extends I18nMixin(LitElement) {
  static styles = discardModalStyles;

  @property({ type: Boolean }) open?: boolean;

  protected override render(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.open}
        @oryx.close=${this.close}
        enableFooter
        preventCloseByEscape
        footerButtonFullWidth
        minimal
      >
        <oryx-heading slot="heading">
          <h2>${this.i18n('picking.discard-pick-list?')}</h2>
        </oryx-heading>

        ${this.i18n('picking.discard.stop-picking-and-discard-pick-list?')}
        <span class="additional-text"
          >${this.i18n('picking.discard.the-pick-list-will-be-lost!')}</span
        >

        <oryx-button
          slot="footer"
          .type=${ButtonType.Outline}
          .color=${ButtonColor.Neutral}
          .size=${ButtonSize.Md}
          @click=${this.close}
        >
          ${this.i18n('picking-lists.cancel')}
        </oryx-button>

        <oryx-button
          slot="footer"
          .color=${ButtonColor.Error}
          .size=${ButtonSize.Md}
          @click=${this.discard}
        >
          ${this.i18n('picking-lists.discard')}
        </oryx-button>
      </oryx-modal>
    `;
  }

  protected close(): void {
    // route leave callback doesn't work properly without this.
    this.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, { bubbles: true, composed: true })
    );
    this.open = false;
  }

  protected discard(): void {
    this.dispatchEvent(
      new CustomEvent(BACK_EVENT, { bubbles: true, composed: true })
    );
  }
}
