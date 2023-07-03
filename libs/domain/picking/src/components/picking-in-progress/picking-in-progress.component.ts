import { ButtonType } from '@spryker-oryx/ui/button';
import { BACK_EVENT } from '@spryker-oryx/ui/modal';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export class PickingInProgressModalComponent extends LitElement {
  @property({ type: Boolean }) open?: boolean;

  protected override render(): TemplateResult {
    return html`<oryx-modal
      enableFooter
      footerButtonFullWidth
      ?open=${this.open}
      @oryx.close=${this.close}
      minimal
    >
      <oryx-heading slot="heading">
        ${i18n('picking.list.picking-in-progress')}
      </oryx-heading>
      ${i18n('picking.list.already-in-progress')}
      <oryx-button slot="footer" type=${ButtonType.Primary} size=${Size.Md}>
        <button @click=${this.closeButton}>
          ${i18n('picking.list.back-to-pick-lists')}
        </button>
      </oryx-button>
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
