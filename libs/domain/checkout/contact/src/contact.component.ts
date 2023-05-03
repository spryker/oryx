import { ContentMixin } from '@spryker-oryx/experience';
import { ContactFormComponent } from '@spryker-oryx/user/contact-form';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';

export class CheckoutContactComponent extends ContentMixin(LitElement) {
  @query('user-contact-form ')
  protected contactComponent!: ContactFormComponent;

  // submit(report = false): boolean {
  //   // const form = this.contactComponent;

  //   // if (!form?.checkValidity()) {
  //   //   if (report) {
  //   //     form?.reportValidity();
  //   //   }

  //   //   this.checkoutDataService.setCustomer(null);

  //   //   return false;
  //   // }

  //   // const data = Object.fromEntries(new FormData(form).entries());

  //   // this.checkoutDataService.setCustomer(data as unknown as ContactDetails);

  //   return true;
  // }

  protected override render(): TemplateResult {
    return html` <user-contact-form></user-contact-form> `;
  }
}
