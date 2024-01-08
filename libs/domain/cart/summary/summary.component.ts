import { CartComponentMixin } from '@spryker-oryx/cart';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { ActionType } from '@spryker-oryx/ui/action';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { CartSummaryOptions } from './summary.model';

@hydrate({ event: 'window:load' })
@defaultOptions({ maxItems: 99 })
export class CartSummaryComponent extends CartComponentMixin(
  ContentMixin<CartSummaryOptions>(LitElement)
) {
  protected override render(): TemplateResult | void {
    return html`<oryx-action
      .icon=${IconTypes.Cart}
      .mark=${this.getQuantity()}
      .text=${this.i18n('cart')}
      .label=${this.i18n('cart')}
      .type=${ActionType.Tile}
      .href=${RouteType.Cart}
    ></oryx-action>`;
  }

  protected getQuantity(): string | number | undefined {
    const quantity = this.$totalQuantity();
    if (!quantity) return;

    const max = this.$options().maxItems;
    return max && quantity > max ? `${max}+` : quantity;
  }
}
