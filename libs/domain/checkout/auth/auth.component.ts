import { AuthService } from '@spryker-oryx/auth';
import { CheckoutMixin, ContactDetails } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import {
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { UserService } from '@spryker-oryx/user';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { map, Observable } from 'rxjs';
import { styles } from './auth.styles';

// TODO: move part of to oryx-guest-checkout component
// TODO: introduce optional guest checkout; if not supported,
//       redirect to login when there's no identity
@hydratable('window:load')
export class CheckoutAuthComponent extends CheckoutMixin(LitElement) {
  static styles = [styles];

  protected userService = resolve(UserService);

  protected authService = resolve(AuthService);
  protected isAuthenticated = signal(this.authService.isAuthenticated(), false);

  protected linkService = resolve(SemanticLinkService);
  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  connectedCallback(): void {
    super.connectedCallback();
    this.checkoutService.register(
      'customer',
      () => this.collectCustomerData(),
      1
    );
  }

  protected collectCustomerData(): Observable<ContactDetails | null> {
    return this.userService
      .getUser()
      .pipe(
        map((user) =>
          user ? (user as ContactDetails) : this.collectGuestForm()
        )
      );
  }

  protected override render(): TemplateResult | void {
    if (this.isAuthenticated()) {
      return html`<h1>${i18n('checkout.checkout')}</h1>`;
    } else {
      // TODO: support without guest checkout
      return this.renderGuestForm();
    }
  }

  protected fieldRenderer = resolve(FormRenderer);

  @query('form')
  protected form?: HTMLFormElement;

  protected renderGuestForm(): TemplateResult {
    const fields: FormFieldDefinition[] = [
      {
        id: 'email',
        type: FormFieldType.Email,
        required: true,
        width: 100,
      },
    ];

    return html`
      <h1>${i18n('checkout.checkout-as-guest')}</h1>
      <p class="have-an-account">
        Have an account already?
        <oryx-link>
          <a href=${this.loginRoute()}>Login to your account</a>
        </oryx-link>
      </p>
      <form>${this.fieldRenderer.buildForm(fields)}</form>
    `;
  }

  protected collectGuestForm(): ContactDetails | null {
    if (!this.form?.checkValidity()) {
      this.form?.reportValidity();
      return null;
    }
    return Object.fromEntries(
      new FormData(this.form).entries()
    ) as unknown as ContactDetails;
  }
}
