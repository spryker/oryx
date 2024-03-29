import { CartComponentMixin } from '@spryker-oryx/cart';
import { ContentMixin } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './heading.styles';

@hydrate({ event: 'window:load' })
export class CartHeadingComponent extends CartComponentMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`<oryx-heading
      .tag=${HeadingTag.H1}
      .typography=${HeadingTag.H3}
    >
      ${this.i18n('cart.totals.<count>-items', {
        count: this.$totalQuantity(),
      })}
    </oryx-heading>`;
  }
}
