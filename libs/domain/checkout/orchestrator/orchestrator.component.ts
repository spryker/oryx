import { CheckoutForm, CheckoutMixin } from '@spryker-oryx/checkout';
import { ContentMixin } from '@spryker-oryx/experience';
import { effect, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { compositionStyles } from './orchestrator.styles';

@hydratable('window:load')
export class CheckoutOrchestratorComponent extends CheckoutMixin(
  ContentMixin(LitElement)
) {
  static styles = [compositionStyles];

  protected eff = effect(() => {
    if (this.isValidating()) {
      const showReport = true;
      let isValid: boolean;
      this.components().forEach((el) => {
        // TODO: use strategies to validate all steps in one go or not
        if (el.validate && isValid !== false) {
          isValid = el.validate(showReport);
        }
      });
    }
  });

  protected override render(): TemplateResult | void {
    if (!this.isAvailable()) return;

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
