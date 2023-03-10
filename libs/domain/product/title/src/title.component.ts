import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { hydratable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@hydratable(['mouseover', 'focusin'])
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = styles;

  protected override render(): TemplateResult | void {
    const options = this.componentOptions ?? {};
    const { tag, as, asLg, asMd, asSm, maxLines } = this.componentOptions ?? {};

    return html`<oryx-heading
      .tag=${tag}
      .maxLines=${maxLines}
      .as=${as}
      .asLg=${asLg}
      .asMd=${asMd}
      .asSm=${asSm}
    >
      ${options?.link ? this.renderLink() : html`${this.product?.name}`}
    </oryx-heading>`;
  }

  protected renderLink(): TemplateResult {
    const options = { type: SemanticLinkType.Product, id: this.product?.sku };

    return html`<oryx-content-link .options=${options}>
      ${this.product?.name}
    </oryx-content-link>`;
  }
}
