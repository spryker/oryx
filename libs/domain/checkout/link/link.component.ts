import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { hydrate, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';

@hydrate({ event: ['window:load'] })
export class CheckoutLinkComponent extends I18nMixin(
  CartComponentMixin(LitElement)
) {
  protected semanticLinkService = resolve(LinkService);

  protected $link = signal(
    this.semanticLinkService.get({ type: RouteType.Checkout })
  );

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      <oryx-button ?loading=${this.$isBusy()}>
        <a href=${this.$link()}>${this.i18n('cart.checkout')}</a>
      </oryx-button>
    `;
  }
}
