import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, html } from 'lit';
import { ProductMixin } from '../src/mixins';

export class ProductSoldByComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    return html`
      Sold by
      <oryx-link
        ><a href="/merchants/123">Sony Expert</a><oryx-link> </oryx-link
      ></oryx-link>
    `;
  }
}
