import { ButtonType } from '@spryker-oryx/ui/button';
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
        enableFooter
        preventCloseByBackdrop
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
          <button>${i18n('picking-lists.discard')}</button>
        </oryx-button>
      </oryx-modal>
    `;
  }

  protected close(): void {
    this.open = false;
  }
}
