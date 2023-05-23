import { CartComponentMixin } from '@spryker-oryx/cart';
import { SemanticLinkType } from '@spryker-oryx/site';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable(['window:load'])
export class CheckoutLinkComponent extends CartComponentMixin(LitElement) {
  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      <oryx-content-link
        .options=${{
          type: SemanticLinkType.Checkout,
          loading: this.$isBusy(),
          button: true,
        }}
      >
        ${i18n('cart.checkout')}
      </oryx-content-link>
    `;
  }
}
