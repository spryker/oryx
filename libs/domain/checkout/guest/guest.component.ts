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
import { Checkout, CheckoutForm, ContactDetails } from '../src/models';
import { CheckoutDataService } from '../src/services/checkout-data.service';

@signalAware()
@hydratable('window:load')
export class CheckoutGuestComponent extends LitElement implements CheckoutForm {
  protected fieldRenderer = resolve(FormRenderer);
  protected linkService = resolve(SemanticLinkService);

  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  protected dataService = resolve(CheckoutDataService);
  protected selected = signal(this.dataService.selected('customer'));

  @state()
  selectedCustomer?: Checkout['customer'] | null;

  protected eff = effect(() => {
    // we need to set the validity when the data is resolvd from storage
    if (!this.selectedCustomer && this.selected()) {
      setTimeout(() => {
        const input = this.input();
        if (input) input.value = this.selectedCustomer?.email ?? '';
        this.dataService.set('customer', !!this.form?.checkValidity());
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

  validate(report?: boolean): boolean {
    if (report) {
      console.log('guest validity?');
      this.form?.reportValidity();
    }
    return !!this.form?.checkValidity();
  }

  protected onChange(ev: Event): void {
    console.log('onChange guest?');
    this.dataService.set('customer', !!this.form?.checkValidity(), {
      email: this.input()?.value,
    } as ContactDetails);
  }

  protected input(): HTMLInputElement | undefined | null {
    return this.form?.querySelector('input');
  }
}
