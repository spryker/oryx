import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { SemanticLinkType } from '@spryker-oryx/site';
import { asyncValue, hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { combineLatest } from 'rxjs';
import { styles } from './link.styles';

@hydratable(['window:load'])
export class CheckoutLinkComponent extends ComponentMixin() {
  static styles = styles;

  protected contentController = new ContentController(this);

  protected cartService = resolve(CartService);

  protected data$ = combineLatest([
    this.cartService.isEmpty(),
    this.cartService.getLoadingState(),
  ]);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.data$, ([isEmptyCart, loading]) => {
        if (isEmptyCart) {
          return html``;
        }

        return html`
          <content-link
            .options="${{
              type: SemanticLinkType.Checkout,
              disabled: loading,
              button: true,
            }}"
          >
            Checkout
          </content-link>
        `;
      })}
    `;
  }
}
