import { CheckoutMixin } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { Size } from '@spryker-oryx/ui';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './guest.styles';

@defaultOptions({
  enableGuestCheckoutByDefault: true,
})
@hydratable('window:load')
export class CheckoutGuestComponent extends CheckoutMixin(LitElement) {
  static styles = [styles];

  protected linkService = resolve(SemanticLinkService);

  protected checkout = signal(
    this.linkService.get({ type: SemanticLinkType.Checkout })
  );

  protected checkoutLogin = signal(
    this.linkService.get({ type: SemanticLinkType.CheckoutLogin })
  );

  connectedCallback(): void {
    if (this.isGuest() || this.isAuthenticated()) {
      const route = this.checkout();
      if (route) resolve(RouterService).navigate(route);
    }
    super.connectedCallback();
  }

  protected override render(): TemplateResult | void {
    if (this.isAuthenticated()) return;

    if (this.isGuest()) {
      return html`<p class="have-an-account">${i18n(
        'checkout.guest.have-an-account?'
      )}</p>
        <oryx-button outline size="md">
          <a href=${this.checkoutLogin()}
            @click=${() => (this.guestCheckout = false)}
          >
            ${i18n('checkout.guest.checkout-with-account')}
        </oryx-button>`;
    }

    return html`<h1>${i18n('checkout.guest.guest-checkout')}</h1>
      <p>${i18n('checkout.guest.continue-without-account')}</p>
      <oryx-button .size=${Size.Md}>
        <a href=${this.checkout()} @click=${() => (this.guestCheckout = true)}>
          ${i18n('checkout.guest.open-checkout')}
        </a>
      </oryx-button>`;
  }

  protected set guestCheckout(value: boolean) {
    this.checkoutDataService.setGuestCheckout(value);
  }
}
