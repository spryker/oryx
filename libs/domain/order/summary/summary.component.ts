import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  computed,
  hydratable,
  i18n,
  signal,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { orderSummaryStyles } from './summary.styles';
import { Address } from '@spryker-oryx/user';

@hydratable('window:load')
export class OrderSummaryComponent extends OrderMixin(
  ContentMixin(LitElement)
) {
  static styles = orderSummaryStyles;

  protected localeService = resolve(LocaleService);

  protected $order = signal(this.orderController.getOrder());
  protected $createdAt = computed(() => {
    const {createdAt} = this.$order() ?? {};
    if (!createdAt) return;
    return this.localeService.formatDateTime(createdAt)
  });

  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`
      <oryx-heading .as=${HeadingTag.H3}>
        <h2>${i18n('order.summary.order-details')}</h2>
      </oryx-heading>
      ${this.renderDetails()}
      <section>
        ${this.renderBilling()} ${this.renderShipping()}
      </section>`;
  }

  protected renderDetails(): TemplateResult {
    return html`
      <div class="details-container">
        <section>
          <div>
            <oryx-icon .type=${IconTypes.Parcel}></oryx-icon>
          </div>
          ${this.renderDetail('order.summary.order-id', this.$order()?.id)}
          <div>
            <oryx-icon .type=${IconTypes.Calendar}></oryx-icon>
          </div>
          ${
            this.renderDetail('order.summary.date', 
            this.$order()?.createdAt,
            html`${this.$createdAt()}`
          )}
        </section>
        <oryx-button outline>
          <button @click=${this.print}>
            <oryx-icon .type=${IconTypes.Printer}></oryx-icon>
            ${i18n('order.summary.print-receipt')}
          </button>
        </oryx-button>
      </div>
      <hr />`;
  }

  protected renderBilling(): TemplateResult {
    return html`
      <oryx-heading .as=${HeadingTag.H6}>
        <h3>${i18n('order.summary.billing-details')}</h3>
      </oryx-heading>
      ${this.renderDetail(
        'order.summary.billing-address',
        this.$order()?.billingAddress,
        html`<oryx-user-address .address=${this.$order()?.billingAddress}></oryx-user-address>`
      )}
      ${this.renderDetail('order.summary.payment', this.$order()?.payments[0].paymentProvider)}
      ${this.renderDetail('order.summary.email', this.$order()?.billingAddress?.email)}
      <hr />
    `;
  }

  protected renderShipping(): TemplateResult {
    return html`
      <oryx-heading .as=${HeadingTag.H6}>
        <h3>${i18n('order.summary.shipping-details')}</h3>
      </oryx-heading>
      ${this.renderDetail(
        'order.summary.delivery-address',
        this.$order()?.shippingAddress,
        html`<oryx-user-address .address=${this.$order()?.shippingAddress}></oryx-user-address>`
      )}
      ${this.renderDetail('order.summary.shipping-method', this.$order()?.shipments[0].shipmentMethodName)}
      ${this.renderDetail('order.summary.email', this.$order()?.shippingAddress?.email)}
      <hr />
    `;
  }

  protected renderDetail(
    title: string,
    detail?: string | number | Address,
    detailTemplate?: TemplateResult
  ): TemplateResult | void {
    if (!detail) return;

    return html`
      <div class="title">${i18n(title)}:</div>
      <div>${detailTemplate ?? detail}</div>
    `;
  }

  protected print(): void {
    window.print();
  }
}
