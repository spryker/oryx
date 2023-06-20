import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address } from '@spryker-oryx/user';
import { computed, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { orderSummaryStyles } from './summary.styles';

@hydratable('window:load')
export class OrderSummaryComponent extends OrderMixin(LitElement) {
  static styles = orderSummaryStyles;

  protected localeService = resolve(LocaleService);

  protected $createdAt = computed(() => {
    if (!this.$order()?.createdAt) return;
    return this.localeService.formatDateTime(this.$order()!.createdAt);
  });

  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html` <oryx-heading .as=${HeadingTag.H3}>
        <h2>${i18n('order.summary.order-details')}</h2>
      </oryx-heading>
      ${this.renderDetails()}
      <section>${this.renderBilling()} ${this.renderShipping()}</section>`;
  }

  protected renderDetails(): TemplateResult {
    return html` <section>
        <oryx-icon .type=${IconTypes.Parcel}></oryx-icon>
        ${this.renderDetail('order.summary.order-id', this.$order()?.id)}
        <oryx-icon .type=${IconTypes.Calendar}></oryx-icon>
        ${this.renderDetail(
          'order.summary.date',
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
        html`<oryx-user-address
          .address=${this.$order()?.billingAddress}
        ></oryx-user-address>`
      )}
      ${this.renderDetail(
        'order.summary.payment',
        this.$order()?.payments[0].paymentProvider
      )}
      ${this.renderDetail(
        'order.summary.email',
        this.$order()?.billingAddress?.email
      )}
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
        html`<oryx-user-address
          .address=${this.$order()?.shippingAddress}
        ></oryx-user-address>`
      )}
      ${this.renderDetail(
        'order.summary.shipping-method',
        this.$order()?.shipments[0].shipmentMethodName
      )}
      ${this.renderDetail(
        'order.summary.email',
        this.$order()?.shippingAddress?.email
      )}
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
