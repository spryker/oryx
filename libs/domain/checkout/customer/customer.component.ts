import { AuthService } from '@spryker-oryx/auth';
import { CheckoutMixin, ContactDetails, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { UserService } from '@spryker-oryx/user';
import { effect, hydratable, i18n, signal } from '@spryker-oryx/utilities';
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

  protected isAuthenticated = signal(this.authService.isAuthenticated(), false);
  protected customer = signal(this.userService.getUser());
  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  // TODO: we need component cycle integration with effect!
  protected eff = effect(() => {
    if (!this.$options().enableGuestCheckout && !this.isAuthenticated()) {
      const route = this.loginRoute();
      if (route) this.routerService.navigate(route);
    }
  });

  protected storeCustomer = effect(() => {
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
  });

  @state()
  protected hasCustomerData = false;

  @query('oryx-checkout-guest')
  protected guest?: CheckoutGuestComponent;

  protected override render(): TemplateResult | void {
    if (this.isAuthenticated()) {
      return html`<h1>${i18n('checkout.checkout')}</h1>`;
    } else if (this.$options().enableGuestCheckout) {
      return html`<oryx-checkout-guest></oryx-checkout-guest>`;
    }
  }

  isValid(report?: boolean): boolean {
    return this.hasCustomerData || !!this.guest?.isValid(report);
  }
}
