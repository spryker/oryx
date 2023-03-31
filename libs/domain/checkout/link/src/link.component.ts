import { CartComponentMixin } from '@spryker-oryx/cart';
import { SemanticLinkType } from '@spryker-oryx/site';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './link.styles';

@hydratable(['window:load'])
export class CheckoutLinkComponent extends CartComponentMixin(LitElement) {
  static styles = styles;

  protected override render(): TemplateResult | void {
    if (this.isEmpty) return;

    const linkOptions = {
      type: SemanticLinkType.Checkout,
      loading: this.isBusy,
      button: true,
    };

    return html`
      <oryx-content-link .options=${linkOptions}>
        ${i18n('cart.checkout')}
      </oryx-content-link>
    `;
  }
}
