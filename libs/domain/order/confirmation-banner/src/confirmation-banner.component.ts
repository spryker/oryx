import { ContentMixin } from '@spryker-oryx/experience';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './confirmation-banner.styles';

export class OrderConfirmationBannerComponent extends OrderMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  @asyncState()
  protected orderRef = valueType(this.orderController.getRef());

  protected override render(): TemplateResult {
    return html`<oryx-heading .as=${HeadingTag.H2}>
        <oryx-image resource="order-confirmation-success"></oryx-image>
        <h1>${i18n('order.confirmation.thank-you')}</h1>
      </oryx-heading>
      <p>
        ${i18n('order.confirmation.your-order-<id>-placed', {
          id: this.orderRef,
        })}
      </p>
      <p>${i18n('order.confirmation.email-sent')}</p> `;
  }
}
