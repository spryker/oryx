import { CheckoutMixin, isValid } from '@spryker-oryx/checkout';
import { ContentMixin } from '@spryker-oryx/experience';
import { elementEffect, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { checkoutOrchestratorStyles } from './orchestrator.styles';

@hydratable('window:load')
export class CheckoutOrchestratorComponent extends CheckoutMixin(
  ContentMixin(LitElement)
) {
  static styles = [checkoutOrchestratorStyles];

  @elementEffect()
  protected eff = () => {
    if (this.isInvalid()) this.report();
  };

  protected override render(): TemplateResult | void {
    if (this.isEmpty()) return;

    return html`
      <experience-composition .uid=${this.uid}></experience-composition>
    `;
  }

  protected report(): void {
    const showReport = true;
    let isValid: boolean;
    this.components().forEach((el) => {
      if (el.isValid && isValid !== false) isValid = el.isValid(showReport);
    });
  }

  protected components(): (isValid & HTMLElement)[] {
    return Array.from(
      this.shadowRoot
        ?.querySelector('experience-composition')
        ?.shadowRoot?.querySelectorAll('*:not(style)') ?? []
    );
  }
}
