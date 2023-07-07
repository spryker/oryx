import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { orderConfirmationBannerStyles } from './confirmation-banner.styles';

export class OrderConfirmationBannerComponent extends I18nMixin(
  OrderMixin(LitElement)
) {
  static styles = orderConfirmationBannerStyles;

  protected orderRef = signal(this.orderController.getRef());

  protected override render(): TemplateResult {
    return html`
      <section>
        <oryx-image .resource=${'order-confirmation-success'}></oryx-image>
        <oryx-heading .as=${HeadingTag.H2}>
          <h1>${this.i18n('order.confirmation.thank-you')}</h1>
        </oryx-heading>
      </section>
      <p>
        ${this.i18n('order.confirmation.order-<id>-placed', {
          id: this.orderRef(),
        })}
      </p>
      <p>${this.i18n('order.confirmation.email-sent')}</p>
    `;
  }
}
