import { AuthService } from '@spryker-oryx/auth';
import { CheckoutMixin, ContactDetails } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { UserService } from '@spryker-oryx/user';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { map, Observable } from 'rxjs';
import { CheckoutGuestComponent } from '../guest';
import { styles } from './auth.styles';

// TODO: introduce optional guest checkout; if not supported,
//       redirect to login when there's no identity
@hydratable('window:load')
export class CheckoutAuthComponent extends CheckoutMixin(LitElement) {
  static styles = [styles];

  protected userService = resolve(UserService);
  protected authService = resolve(AuthService);

  protected isAuthenticated = signal(this.authService.isAuthenticated(), false);

  @query('oryx-checkout-guest')
  protected guest?: CheckoutGuestComponent;

  connectedCallback(): void {
    super.connectedCallback();
    this.checkoutService.register('customer', () => this.collectData(), 1);
  }

  protected override render(): TemplateResult | void {
    if (this.isAuthenticated()) {
      return html`<h1>${i18n('checkout.checkout')}</h1>`;
    } else {
      // TODO: support without guest checkout
      return html`<oryx-checkout-guest></oryx-checkout-guest>`;
    }
  }

  protected collectData(): Observable<ContactDetails | null> {
    return this.userService
      .getUser()
      .pipe(
        map((user) => (user as ContactDetails) ?? this.guest?.collectData())
      );
  }
}
