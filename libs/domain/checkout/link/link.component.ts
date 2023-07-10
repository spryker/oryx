import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { hydratable, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydratable(['window:load'])
export class CheckoutLinkComponent extends I18nMixin(
  CartComponentMixin(LitElement)
) {
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $link = signal(
    this.semanticLinkService.get({ type: SemanticLinkType.Checkout })
  );

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      <oryx-action ?loading=${this.$isBusy()} custom>
        <a href=${this.$link()}>${this.i18n('cart.checkout')}</a>
      </oryx-action>
    `;
  }
}
