import { CheckoutMixin } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { CheckoutCompositionComponentOptions } from './composition.model';
import { compositionStyles } from './composition.styles';

@defaultOptions({
  checkoutAuthPage: '/checkout-login',
})
@hydratable('window:load')
export class CheckoutCompositionComponent extends CheckoutMixin(
  ContentMixin<CheckoutCompositionComponentOptions>(LitElement)
) {
  static styles = [compositionStyles];

  protected requiresRedirect = computed(
    () =>
      this.$options().checkoutAuthPage &&
      !this.isGuest() &&
      !this.isAuthenticated()
  );

  connectedCallback(): void {
    if (this.requiresRedirect()) {
      const route = this.$options().checkoutAuthPage;
      if (route) resolve(RouterService).navigate(route);
    }
    super.connectedCallback();
  }

  protected override render(): TemplateResult | void {
    if (this.isEmpty() || this.requiresRedirect()) return;

    return html`
      <experience-composition .uid=${this.uid}></experience-composition>
    `;
  }
}
