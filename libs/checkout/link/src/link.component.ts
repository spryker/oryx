import { CartService } from '@spryker-oryx/cart';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { SemanticLinkType } from '@spryker-oryx/site';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';
import { styles } from './link.styles';

@hydratable(['window:load'])
export class CheckoutLinkComponent extends ComponentMixin() {
  static styles = styles;

  protected contentController = new ContentController(this);

  protected cartService = resolve(CartService);

  protected isEmptyCart$ = this.cartService
    .getEntries()
    .pipe(map((entries) => !entries?.length));

  protected loading$ = this.cartService.isLoading;

  protected data$ = combineLatest([this.isEmptyCart$, this.loading$]);

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
