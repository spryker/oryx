import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { I18nMixin, featureVersion, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
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
        ${this.__renderHeading()}
      </section>
      <p>
        ${this.i18n('order.confirmation.order-<id>-placed', {
          id: this.orderRef(),
        })}
      </p>
      <p>${this.i18n('order.confirmation.email-sent')}</p>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    const text = this.i18n('order.confirmation.thank-you');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading
        .tag=${HeadingTag.H1}
        .typography=${HeadingTag.H2}
        >${text}</oryx-heading
      >`;
    } else {
      return html`<oryx-heading .as=${HeadingTag.H2}>
        <h1>${text}</h1>
      </oryx-heading>`;
    }
  }
}
