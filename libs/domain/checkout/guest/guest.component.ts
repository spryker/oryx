import { resolve } from '@spryker-oryx/di';
import {
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  effect,
  hydratable,
  i18n,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { Checkout, CheckoutForm } from '../src/models';
import { CheckoutStateService } from '../src/services';

@signalAware()
@hydratable('window:load')
export class CheckoutGuestComponent extends LitElement implements CheckoutForm {
  protected fieldRenderer = resolve(FormRenderer);
  protected linkService = resolve(SemanticLinkService);

  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  protected checkoutStateService = resolve(CheckoutStateService);
  protected selected = signal(this.checkoutStateService.get('customer'));

  @state()
  selectedCustomer?: Checkout['customer'] | null;

  protected eff = effect(() => {
    // we need to set the validity when the data is resolvd from storage
    if (!this.selectedCustomer && this.selected()) {
      setTimeout(() => {
        const input = this.input();
        if (input) input.value = this.selectedCustomer?.email ?? '';
        this.checkoutStateService.set('customer', !!this.form?.checkValidity());
      }, 0);
    }
    this.selectedCustomer = this.selected();
  });

  @query('form')
  protected form?: HTMLFormElement;

  protected fields: FormFieldDefinition[] = [
    {
      id: 'email',
      type: FormFieldType.Email,
      required: true,
    },
  ];

  protected override render(): TemplateResult | void {
    return html`
      <h1>${i18n('checkout.checkout-as-guest')}</h1>
      <p class="have-an-account">
        ${i18n('checkout.guest.have-an-account')}
        <oryx-link>
          <a href=${this.loginRoute()}>
            ${i18n('checkout.guest.login-to-your-account')}
          </a>
        </oryx-link>
      </p>
      <form @change=${this.onChange}>
        ${this.fieldRenderer.buildForm(this.fields)}
      </form>
    `;
  }

  report(report?: boolean): boolean {
    if (report) {
      this.form?.reportValidity();
    }
    return !!this.form?.checkValidity();
  }

  protected onChange(): void {
    this.checkoutStateService.set('customer', !!this.form?.checkValidity(), {
      email: this.input()?.value,
    });
  }

  protected input(): HTMLInputElement | undefined | null {
    return this.form?.querySelector('input');
  }
}
