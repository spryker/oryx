import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutComponentMixin,
  CheckoutDataService,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { Size } from '@spryker-oryx/ui';
import { effect, hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './guest.styles';

@hydratable('window:load')
export class CheckoutGuestComponent extends CheckoutComponentMixin(LitElement) {
  static styles = [styles];

  protected checkoutDataService = resolve(CheckoutDataService);
  protected authService = resolve(AuthService);
  protected linkService = resolve(SemanticLinkService);

  protected isGuest = signal(this.checkoutDataService.isGuestCheckout());
  protected isAuthenticated = signal(this.authService.isAuthenticated());

  protected checkoutRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Checkout })
  );

  protected eff = effect(() => {
    if (this.isGuest() || this.isAuthenticated()) this.redirect();
  });

  protected override render(): TemplateResult | void {
    return html` <h2>${i18n('checkout.guest-checkout')}</h2>
      <p>${i18n('checkout.guest.checkout-without-account')}</p>
      <oryx-button .size=${Size.Md}>
        <a href=${this.checkoutRoute()} @click=${this.setGuest}>
          ${i18n('checkout.guest.checkout-link')}
        </a>
      </oryx-button>`;
  }

  protected setGuest(): void {
    this.checkoutDataService.setGuestCheckout(true);
  }

  protected redirect(): void {
    const route = this.checkoutRoute();
    if (route) {
      resolve(RouterService).navigate(route);
    }
  }
}
