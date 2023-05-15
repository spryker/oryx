import { CheckoutForm, CheckoutMixin } from '@spryker-oryx/checkout';
import { ContentMixin } from '@spryker-oryx/experience';
import { effect, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { compositionStyles } from './checkout.styles';

@hydratable('window:load')
export class CheckoutComponent extends CheckoutMixin(ContentMixin(LitElement)) {
  static styles = [compositionStyles];

  protected eff = effect(() => {
    if (this.isInvalid()) {
      const showReport = true;
      let isValid: boolean;
      this.components().forEach((el) => {
        // TODO: use strategies to validate all steps in one go or not
        if (el.report && isValid !== false) {
          isValid = el.report(showReport);
        }
      });
    }
  });

  protected override render(): TemplateResult | void {
    if (this.isEmpty()) return;

    return html`
      <experience-composition .uid=${this.uid}></experience-composition>
    `;
  }

  protected components(): (CheckoutForm & HTMLElement)[] {
    return Array.from(
      this.shadowRoot
        ?.querySelector('experience-composition')
        ?.shadowRoot?.querySelectorAll('*:not(style)') ?? []
    );
  }
}
