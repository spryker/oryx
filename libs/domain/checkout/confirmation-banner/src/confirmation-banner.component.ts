import { OrderController } from '@spryker-oryx/checkout';
import { ComponentMixin } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { asyncValue, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './confirmation-banner.styles';

export class OrderConfirmationBannerComponent extends ComponentMixin() {
  static styles = styles;

  @property({ type: String }) 'order-id'?: string;

  protected orderController = new OrderController(this);

  protected orderId$ = this.orderController.getRef();

  protected override render(): TemplateResult {
    return html`<oryx-heading .appearance=${HeadingTag.H2}>
        <oryx-image resource="order-confirmation-success"></oryx-image>
        <h1>${i18n('order.confirmation.thank-you')}</h1>
      </oryx-heading>
      ${asyncValue(
        this.orderId$,
        (id) =>
          html`<p>
              ${i18n('order.confirmation.your-order-<id>-placed', { id })}
            </p>
            <p>${i18n('order.confirmation.email-sent')}</p>`
      )}`;
  }
}
