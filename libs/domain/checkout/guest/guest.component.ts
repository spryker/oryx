import { CheckoutComponentMixin } from '@spryker-oryx/checkout';
import { Size } from '@spryker-oryx/ui';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './guest.styles';

@hydratable('window:load')
export class CheckoutGuestComponent extends CheckoutComponentMixin(LitElement) {
  static styles = [styles];

  protected override render(): TemplateResult | void {
    return html`<h2>${i18n('checkout.guest.guest-checkout')}</h2>
      <p>${i18n('checkout.guest.continue-without-account')}</p>
      <oryx-button .size=${Size.Md}>
        <a href=${this.routes.checkout()} @click=${this.onClick}>
          ${i18n('checkout.guest.open-checkout')}
        </a>
      </oryx-button>`;
  }

  protected onClick(): void {
    this.checkoutDataService.setGuestCheckout(true);
  }
}
