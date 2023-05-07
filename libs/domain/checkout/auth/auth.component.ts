import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutForm,
  CheckoutMixin,
  ContactDetails,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { UserService } from '@spryker-oryx/user';
import { effect, hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { map, Observable } from 'rxjs';
import { CheckoutGuestComponent } from '../guest';
import { CheckoutAuthComponentOptions } from './auth.model';
import { styles } from './auth.styles';

@defaultOptions({ enableGuestCheckout: true })
@hydratable('window:load')
export class CheckoutAuthComponent
  extends CheckoutMixin(ContentMixin<CheckoutAuthComponentOptions>(LitElement))
  implements CheckoutForm
{
  static styles = [styles];

  protected userService = resolve(UserService);
  protected authService = resolve(AuthService);

  protected isAuthenticated = signal(this.authService.isAuthenticated(), false);

  protected linkService = resolve(SemanticLinkService);
  protected routerService = resolve(RouterService);
  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  @query('oryx-checkout-guest')
  protected guest?: CheckoutGuestComponent;

  // TODO: we need component cycle integration with effect!
  protected eff = effect(() => {
    if (!this.$options().enableGuestCheckout && !this.isAuthenticated()) {
      const route = this.loginRoute();
      if (route) this.routerService.navigate(route);
    }
  });

  validate(report: boolean): boolean {
    return !!this.guest?.validate(report);
  }

  // connectedCallback(): void {
  //   super.connectedCallback();

  //   this.addEventListener('validate', () => {
  //     console.log('validate form!');
  //     this.guest?.collectData();
  //     // optionally: update form
  //     // this.form?.reportValidity();
  //   });

  //   // this.checkoutService.register({
  //   //   id: 'customer',
  //   //   collectDataCallback: () => this.collectData(),
  //   //   order: 1,
  //   // });

  //   // this.checkoutService.getValidityTrigger('customer').pipe(
  //   //   // TODO: invoke form validity
  //   //   map(() => true),
  //   //   tap((result) => console.log(result))
  //   // );

  //   // this.checkoutService.onValid('customer').pipe(
  //   //   // TODO: invoke form validity
  //   //   map(() => true),
  //   //   tap((result) => console.log(result))
  //   // );
  // }

  protected override render(): TemplateResult | void {
    if (this.isAuthenticated()) {
      return html`<h1>${i18n('checkout.checkout')}</h1>`;
    } else if (this.$options().enableGuestCheckout) {
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
