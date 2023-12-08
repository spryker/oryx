import { PickingListMixin } from '@spryker-oryx/picking';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, computed, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { PickingCustomerNoteComponentProperties } from './customer-note-modal.model';

export class PickingCustomerNoteModalComponent
  extends I18nMixin(PickingListMixin(LitElement))
  implements PickingCustomerNoteComponentProperties
{
  @property({ type: Boolean }) open?: boolean;
  @property({ type: Boolean }) hideTrigger?: boolean;

  protected $cartNote = computed(() => this.$pickingList()?.cartNote);

  protected override render(): TemplateResult | void {
    if (!this.$cartNote()) return;

    return html`
      ${when(
        !this.hideTrigger,
        () => html`<oryx-button
          type=${ButtonType.Icon}
          label=${this.i18n('oryx.picking.customer-note')}
          icon=${IconTypes.Info}
          @click=${() => (this.open = true)}
        ></oryx-button> `
      )}

      <oryx-modal ?open=${this.open} enableFooter footerButtonFullWidth minimal>
        ${this.__renderHeading()}${this.$cartNote()}

        <oryx-button
          slot="footer"
          color=${ButtonColor.Primary}
          size=${ButtonSize.Md}
          icon=${IconTypes.Check}
          text=${this.i18n('picking-lists.customer-note.got-it')}
          @click=${() => (this.open = false)}
        ></oryx-button>
      </oryx-modal>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    const text = this.i18n('picking-lists.customer-note.customer-note');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading slot="heading" .tag=${HeadingTag.H2}>
        ${text}
      </oryx-heading>`;
    } else {
      return html` <oryx-heading slot="heading">
        <h2>${text}</h2>
      </oryx-heading>`;
    }
  }
}
