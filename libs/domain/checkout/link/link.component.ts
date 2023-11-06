import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { hydrate, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { checkoutLinkStyles } from './link.styles';

@hydrate({ event: ['window:load'] })
export class CheckoutLinkComponent extends I18nMixin(
  CartComponentMixin(LitElement)
) {
  static styles = [checkoutLinkStyles];

  protected semanticLinkService = resolve(LinkService);

  protected $link = signal(
    this.semanticLinkService.get({ type: RouteType.Checkout })
  );

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) {
      return;
    }

    return html`
      <oryx-button
        .text=${this.i18n('cart.checkout')}
        .href=${this.$link()}
        ?loading=${this.$isBusy()}
        repeatable="click"
      ></oryx-button>
    `;
  }
}
