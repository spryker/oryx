import { ButtonType } from '@spryker-oryx/ui/button';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

export class PickingInProgressModalComponent extends LitElement {
  @state()
  protected pickingInProgress?: boolean;

  open(): void {
    this.pickingInProgress = true;
  }

  protected override render(): TemplateResult {
    return html`<oryx-modal
      ?open=${this.pickingInProgress}
      enableFooter
      footerButtonFullWidth
      @oryx.close=${this.close}
    >
      <oryx-heading slot="heading">
        ${i18n('picking.list.picking-in-progress')}
      </oryx-heading>
      ${i18n('picking.list.already-in-progress')}
      <oryx-button slot="footer" type=${ButtonType.Primary} size=${Size.Md}>
        <button @click=${this.close}>
          ${i18n('picking.list.back-to-pick-lists')}
        </button>
      </oryx-button>
    </oryx-modal>`;
  }

  protected close(): void {
    this.pickingInProgress = false;
  }
}
