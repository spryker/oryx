import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { hydrate, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydrate({ event: ['window:load'] })
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
      <oryx-button
        ?loading=${this.$isBusy()}
        .href=${this.$link()}
        .text=${this.i18n('cart.checkout')}
        block
      >
      </oryx-button>
    `;
  }
}
