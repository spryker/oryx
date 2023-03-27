import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  asyncState,
  asyncValue,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { styles } from './summary.styles';

@hydratable('window:load')
export class OrderSummaryComponent extends OrderMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  @asyncState()
  protected order = valueType(this.orderController.getOrder());
  protected locale = resolve(LocaleService);

  protected override render(): TemplateResult {
    return this.order
      ? html`${this.renderDetails()}
          <div class="details">
            ${this.renderBilling()} ${this.renderShipping()}
          </div>`
      : html``;
  }

  protected renderDetails(): TemplateResult {
    return html`<oryx-heading .as=${HeadingTag.H3}>
        <h2>${i18n('order.order-details')}</h2>
      </oryx-heading>
      <div class="details-container">
        <div class="details summary">
          <div>
            <oryx-icon type="parcel"></oryx-icon>
          </div>
          <div class="title">${i18n('order.order-id')}:</div>
          <div>${this.order?.id}</div>
          <div>
            <oryx-icon type="calendar"></oryx-icon>
          </div>
          <div class="title">${i18n('order.date')}:</div>
          <div>
            ${asyncValue(
              this.locale.formatDate(this.order?.createdAt ?? '', true, true)
            )}
          </div>
        </div>
        <oryx-button outline>
          <button @click=${this.print}>
            <oryx-icon type="printer"></oryx-icon>
            ${i18n('order.print-your-receipt')}
          </button>
        </oryx-button>
      </div>
      <hr />`;
  }

  protected renderBilling(): TemplateResult {
    return html`<oryx-heading .as=${HeadingTag.H6}>
        <h3>${i18n('order.billing-details')}</h3>
      </oryx-heading>
      ${when(
        this.order?.billingAddress,
        () => html` <div class="title">${i18n('order.billing-address')}:</div>
          <div>
            <oryx-user-address .address=${this.order?.billingAddress}>
            </oryx-user-address>
          </div>`
      )}
      <div class="title">${i18n('order.payment')}:</div>
      <div>${this.order?.payments[0].paymentProvider}</div>
      ${when(
        this.order?.billingAddress?.email,
        () => html`
          <div class="title">${i18n('order.email')}:</div>
          <div>${this.order?.billingAddress?.email}</div>
        `
      )}
      <hr />`;
  }

  protected renderShipping(): TemplateResult {
    return html`<oryx-heading .as=${HeadingTag.H6}>
        <h3>${i18n('order.shipping-details')}</h3>
      </oryx-heading>
      ${when(
        this.order?.shippingAddress,
        () => html` <div class="title">${i18n('order.delivery-address')}:</div>
          <div>
            <oryx-user-address .address=${this.order?.shippingAddress}>
            </oryx-user-address>
          </div>`
      )}
      <div class="title">${i18n('order.shipping-method')}:</div>
      <div>${this.order?.shipments[0].shipmentMethodName}</div>
      ${when(
        this.order?.shippingAddress?.email,
        () => html`
          <div class="title">${i18n('order.email')}:</div>
          <div>${this.order?.shippingAddress?.email}</div>
        `
      )}
      <hr />`;
  }

  protected print(): void {
    window.print();
  }
}
