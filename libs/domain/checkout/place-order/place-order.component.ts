import { CheckoutMixin } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { hydratable, I18nMixin } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable({ event: 'window:load' })
export class CheckoutPlaceOrderComponent extends I18nMixin(
  CheckoutMixin(LitElement)
) {
  protected router = resolve(RouterService);

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`<oryx-button
      ?inert=${this.$isBusy()}
      ?loading=${this.$isBusy()}
      @click="${this.onClick}"
    >
      <button>${this.i18n('checkout.place-order')}</button>
    </oryx-button>`;
  }

  protected onClick(): void {
    this.checkoutService.placeOrder().subscribe((response) => {
      if (response.redirectUrl) {
        this.redirect(response.redirectUrl);
      }
    });
  }

  protected redirect(url: string): void {
    if (url) this.router.navigate(url);
  }
}
