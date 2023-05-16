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
import { query } from 'lit/decorators.js';
import { isValid } from '../src/models';
import { CheckoutStateService } from '../src/services';

@signalAware()
@hydratable('window:load')
export class CheckoutGuestComponent extends LitElement implements isValid {
  protected fieldRenderer = resolve(FormRenderer);
  protected linkService = resolve(SemanticLinkService);

  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  protected checkoutStateService = resolve(CheckoutStateService);
  protected selected = signal(this.checkoutStateService.get('customer'));

  protected eff = effect(() => {
    if (this.selected()) {
      setTimeout(() => {
        const input = this.input();
        if (input) input.value = this.selected()?.email ?? '';
        this.checkoutStateService.set('customer', {
          valid: !!this.form?.checkValidity(),
        });
      }, 0);
    }
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

  isValid(report?: boolean): boolean {
    if (report) {
      this.form?.reportValidity();
    }
    return !!this.form?.checkValidity();
  }

  protected onChange(): void {
    this.checkoutStateService.set('customer', {
      valid: !!this.form?.checkValidity(),
      value: { email: this.input()?.value },
    });
  }

  protected input(): HTMLInputElement | undefined | null {
    return this.form?.querySelector('input');
  }
}
