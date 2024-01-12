import { ContentMixin } from '@spryker-oryx/experience';
import { PRODUCT, ProductMixin } from '@spryker-oryx/product';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';

@hydrate({ context: PRODUCT })
export class ProductDiscontinuedComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    const { discontinued, discontinuedNote } = this.$product() || {};
    if (!discontinued) return;
    return html`${discontinuedNote || this.i18n('product.discontinued')}`;
  }
}
