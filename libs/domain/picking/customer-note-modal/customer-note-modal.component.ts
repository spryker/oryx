import { PickingListMixin } from '@spryker-oryx/picking';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';

export class PickingCustomerNoteModalComponent extends I18nMixin(
  PickingListMixin(LitElement)
) {
  @property({ type: Boolean }) open?: boolean;

  protected $cartNote = computed(() => this.$pickingList()?.cartNote)

  protected override render(): TemplateResult | void {
    if (!this.$cartNote()) return;

    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${ButtonSize.Md}
        .label=${this.i18n('oryx.picking.customer-note')}
        .icon=${IconTypes.Info}
        @click=${() => this.open = true}
      ></oryx-button>
      <oryx-modal ?open=${this.open} enableFooter footerButtonFullWidth minimal>
        <oryx-heading slot="heading">
          <h2>${this.i18n('picking-lists.customer-note.customer-note')}</h2>
        </oryx-heading>

        ${this.$cartNote()}

        <oryx-button
          slot="footer"
          .color=${ButtonColor.Primary}
          .size=${ButtonSize.Md}
          .icon=${IconTypes.Check}
          .text=${this.i18n('picking-lists.customer-note.got-it')}
          @click=${() => this.open = false}
        ></oryx-button>
      </oryx-modal>
    `;
  }
}
