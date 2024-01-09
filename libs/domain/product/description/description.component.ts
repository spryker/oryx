import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { PRODUCT, ProductContext, ProductMixin } from '@spryker-oryx/product';
import { CollapsibleTextToggle } from '@spryker-oryx/ui/collapsible-text';
import { featureVersion, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { ProductDescriptionOptions } from './description.model';
import { convertLineFeedsToHTML } from './utils';

@defaultOptions({ lineClamp: 3, enableToggle: true })
@hydrate({
  event: ['mouseover', 'window:resize'],
  context: featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU,
})
export class ProductDescriptionComponent extends ProductMixin(
  ContentMixin<ProductDescriptionOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    const { lineClamp = 0, enableToggle } = this.$options();

    return html`
      <oryx-collapsible-text
        .lineClamp=${lineClamp}
        .toggle=${enableToggle
          ? CollapsibleTextToggle.Icon
          : CollapsibleTextToggle.None}
      >
        ${unsafeHTML(this.convert(this.$product()?.description))}
      </oryx-collapsible-text>
    `;
  }

  protected convert(text?: string): string {
    return convertLineFeedsToHTML(text ?? '');
  }
}
