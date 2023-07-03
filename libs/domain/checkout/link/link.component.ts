import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable(['window:load'])
export class CheckoutLinkComponent extends CartComponentMixin(LitElement) {
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $link = signal(
    this.semanticLinkService.get({ type: SemanticLinkType.Checkout })
  );

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      <oryx-button ?loading=${this.$isBusy()}>
        <a href=${this.$link()}>${i18n('cart.checkout')}</a>
      </oryx-button>
    `;
  }
}
