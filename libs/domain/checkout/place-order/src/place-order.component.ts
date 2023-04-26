import { CheckoutMixin } from '@spryker-oryx/checkout';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable('window:load')
export class CheckoutPlaceOrderComponent extends CheckoutMixin(LitElement) {
  protected isBusy = signal(false);

  protected override render(): TemplateResult | void {
    if (this.isEmpty()) return;

    return html`<oryx-button
      ?inert=${this.isBusy()}
      ?loading=${this.isBusy()}
      @click="${this.onClick}"
    >
      <button>${i18n('checkout.place-order')}</button>
    </oryx-button>`;
  }

  protected onClick(): void {
    this.isBusy.set(true);
    this.checkoutService.placeOrder().subscribe({
      complete: () => this.isBusy.set(false),
      error: (error) => {
        this.isBusy.set(false);
        throw error;
      },
    });
  }
}
