import { CheckoutMixin, isValid } from '@spryker-oryx/checkout';
import { ContentMixin } from '@spryker-oryx/experience';
import { effect, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { compositionStyles } from './checkout.styles';

@hydratable('window:load')
export class CheckoutComponent extends CheckoutMixin(ContentMixin(LitElement)) {
  static styles = [compositionStyles];

  protected eff = effect(() => {
    if (this.isInvalid()) this.report();
  });

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
