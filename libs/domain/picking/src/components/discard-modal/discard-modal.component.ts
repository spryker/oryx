import { ButtonType } from '@spryker-oryx/ui/button';
import { BACK_EVENT, CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { discardModalStyles } from './discard-modal.styles';

export class DiscardPickingComponent extends LitElement {
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
          <h2>${i18n('picking.discard-pick-list?')}</h2>
        </oryx-heading>

        ${i18n('picking.discard.stop-picking-and-discard-pick-list?')}
        <span class="additional-text"
          >${i18n('picking.discard.the-pick-list-will-be-lost!')}</span
        >

        <oryx-button
          slot="footer"
          outline
          type=${ButtonType.Secondary}
          size=${Size.Md}
        >
          <button @click=${this.close}>${i18n('picking-lists.cancel')}</button>
        </oryx-button>

        <oryx-button slot="footer" type=${ButtonType.Critical} size=${Size.Md}>
          <button @click=${this.discard}>
            ${i18n('picking-lists.discard')}
          </button>
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
