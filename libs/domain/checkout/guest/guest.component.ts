import { resolve } from '@spryker-oryx/di';
import {
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { ContactDetails } from '../src/models';

// TODO: introduce optional guest checkout; if not supported,
//       redirect to login when there's no identity
@signalAware()
@hydratable('window:load')
export class CheckoutGuestComponent extends LitElement {
  protected fieldRenderer = resolve(FormRenderer);
  protected linkService = resolve(SemanticLinkService);

  protected loginRoute = signal(
    this.linkService.get({ type: SemanticLinkType.Login })
  );

  @query('form')
  protected form?: HTMLFormElement;

  protected override render(): TemplateResult | void {
    const guestFields: FormFieldDefinition[] = [
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
        ${i18n('checkout.guest.have-an-account')}
        <oryx-link>
          <a href=${this.loginRoute()}>
            ${i18n('checkout.guest.login-to-your-account')}
          </a>
        </oryx-link>
      </p>
      <form>${this.fieldRenderer.buildForm(guestFields)}</form>
    `;
  }

  collectData(): ContactDetails | null {
    if (!this.form?.checkValidity()) {
      this.form?.reportValidity();
      return null;
    }
    return Object.fromEntries(
      new FormData(this.form).entries()
    ) as unknown as ContactDetails;
  }
}
