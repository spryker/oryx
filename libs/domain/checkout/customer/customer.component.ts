import { AuthService } from '@spryker-oryx/auth';
import { CheckoutMixin, ContactDetails, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { UserService } from '@spryker-oryx/user';
import {
  elementEffect,
  hydratable,
  i18n,
  signal,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { CheckoutGuestComponent } from '../guest';
import { CheckoutAuthComponentOptions } from './customer.model';
import { styles } from './customer.styles';

@defaultOptions({ enableGuestCheckout: true })
@hydratable('window:load')
export class CheckoutCustomerComponent
  extends CheckoutMixin(ContentMixin<CheckoutAuthComponentOptions>(LitElement))
  implements isValid
{
  static styles = [styles];

  protected userService = resolve(UserService);
  protected authService = resolve(AuthService);
  protected linkService = resolve(SemanticLinkService);
  protected routerService = resolve(RouterService);

  protected isAuthenticated = signal(this.authService.isAuthenticated(), {
    initialValue: false,
  });
  protected customer = signal(this.userService.getUser());
  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  @state()
  protected hasCustomerData = false;

  @elementEffect()
  protected eff = (): void => {
    if (!this.$options().enableGuestCheckout && !this.isAuthenticated()) {
      const route = this.loginRoute();
      if (route) this.routerService.navigate(route);
    }
  };

  @elementEffect()
  protected storeCustomer = (): void => {
    const customer = this.customer();
    if (customer) {
      const { email, salutation, firstName, lastName } =
        customer as ContactDetails;
      this.hasCustomerData = true;
      this.checkoutStateService.set('customer', {
        valid: this.hasCustomerData,
        value: { email, salutation, firstName, lastName },
      });
    }
  };

  @query('oryx-checkout-guest')
  protected guest?: CheckoutGuestComponent;

  protected override render(): TemplateResult | void {
    if (this.isAuthenticated()) {
      const { email, firstName, lastName } = this.customer() ?? {};

      return html`<h3>${i18n('checkout.checking-out-as')}</h3>
        <p>
          ${firstName} ${lastName}<br />
          ${email}
        </p>`;
    } else if (this.$options().enableGuestCheckout) {
      return html`<oryx-checkout-guest></oryx-checkout-guest>`;
    }
  }

  isValid(report?: boolean): boolean {
    return this.hasCustomerData || !!this.guest?.isValid(report);
  }
}
