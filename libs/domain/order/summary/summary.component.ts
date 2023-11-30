import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { OrderMixin } from '@spryker-oryx/order';
import { ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address } from '@spryker-oryx/user';
import {
  computed,
  featureVersion,
  hydrate,
  I18nMixin,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { orderSummaryStyles } from './summary.styles';

@hydrate({ event: 'window:load' })
export class OrderSummaryComponent extends I18nMixin(OrderMixin(LitElement)) {
  static styles = orderSummaryStyles;

  protected localeService = resolve(LocaleService);

  protected $createdAt = computed(() => {
    if (!this.$order()?.createdAt) return;
    return this.localeService.formatDateTime(this.$order()!.createdAt);
  });

  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`${this.__renderHeading()}${this.renderDetails()}
      <section>${this.renderBilling()} ${this.renderShipping()}</section>`;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    const text = this.i18n('order.summary.order-details');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading
        .tag=${HeadingTag.H2}
        .typography=${HeadingTag.H3}
      >
        ${text}
      </oryx-heading>`;
    } else {
      return html`<oryx-heading .as=${HeadingTag.H3}>
        <h2>${text}</h2>
      </oryx-heading>`;
    }
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
      <oryx-button
        .type=${ButtonType.Outline}
        .text=${this.i18n('order.summary.print-receipt')}
        .icon=${IconTypes.Printer}
        @click=${this.onPrint}
      ></oryx-button>
      <hr />`;
  }

  protected renderBilling(): TemplateResult {
    return html`
      <oryx-heading .as=${HeadingTag.H6}>
        <h3>${this.i18n('order.summary.billing-details')}</h3>
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
        <h3>${this.i18n('order.summary.shipping-details')}</h3>
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
      <div class="title">${this.i18n(title)}:</div>
      <div>${detailTemplate ?? detail}</div>
    `;
  }

  protected onPrint(): void {
    window.print();
  }
}
