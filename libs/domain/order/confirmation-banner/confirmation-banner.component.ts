import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { orderConfirmationBannerStyles } from './confirmation-banner.styles';

export class OrderConfirmationBannerComponent extends OrderMixin(LitElement) {
  static styles = orderConfirmationBannerStyles;

  protected orderRef = signal(this.orderController.getRef());

  protected override render(): TemplateResult {
    return html`
      <section>
        <oryx-image .resource=${'order-confirmation-success'}></oryx-image>
        <oryx-heading .as=${HeadingTag.H2}>
          <h1>${i18n('order.confirmation.thank-you')}</h1>
        </oryx-heading>
      </section>
      <p>
        ${i18n('order.confirmation.order-<id>-placed', {
          id: this.orderRef(),
        })}
      </p>
      <p>${i18n('order.confirmation.email-sent')}</p>
    `;
  }
}
