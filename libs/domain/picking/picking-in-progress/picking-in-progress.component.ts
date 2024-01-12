import { ButtonColor, ButtonSize } from '@spryker-oryx/ui/button';
import { BACK_EVENT } from '@spryker-oryx/ui/modal';
import { I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';

export class PickingInProgressModalComponent extends I18nMixin(LitElement) {
  @property({ type: Boolean }) open?: boolean;

  protected override render(): TemplateResult {
    return html`<oryx-modal
      enableFooter
      footerButtonFullWidth
      ?open=${this.open}
      @oryx.close=${this.close}
      @oryx.modal.closed=${this.close}
      minimal
    >
      <oryx-heading slot="heading">
        ${this.i18n('picking.list.picking-in-progress')}
      </oryx-heading>
      ${this.i18n('picking.list.already-in-progress')}
      <oryx-button
        slot="footer"
        .color=${ButtonColor.Primary}
        .size=${ButtonSize.Md}
        .text=${this.i18n('picking.list.back-to-pick-lists')}
        @click=${this.closeButton}
      ></oryx-button>
    </oryx-modal>`;
  }

  protected close(): void {
    this.open = false;
  }

  protected closeButton(): void {
    this.dispatchEvent(
      new CustomEvent(BACK_EVENT, { bubbles: true, composed: true })
    );
    this.close();
  }
}
