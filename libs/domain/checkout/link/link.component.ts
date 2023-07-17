import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { RouteLinkType } from '@spryker-oryx/router/lit';
import { SemanticLinkService } from '@spryker-oryx/site';
import { hydrate, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

@hydrate({ event: ['window:load'] })
export class CheckoutLinkComponent extends I18nMixin(
  CartComponentMixin(LitElement)
) {
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $link = signal(
    this.semanticLinkService.get({ type: RouteLinkType.Checkout })
  );

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      <oryx-button ?loading=${this.$isBusy()}>
        <a href=${ifDefined(this.$link())}>${this.i18n('cart.checkout')}</a>
      </oryx-button>
    `;
  }
}
