import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { hydratable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { html } from 'lit/static-html.js';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@hydratable(['mouseover', 'focusin'])
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = styles;

  protected override render(): TemplateResult {
    const options = this.componentOptions;

    return html`<oryx-heading
      tag=${ifDefined(options?.tag)}
      maxLines=${ifDefined(options?.maxLines)}
    >
      ${options?.link ? this.renderLink() : html`${this.product?.name}`}
    </oryx-heading>`;
  }

  protected renderLink(): TemplateResult {
    const options = {
      type: SemanticLinkType.Product,
      id: this.product?.sku,
      multiLine: true,
    };

    return html`<oryx-content-link .options=${options}>
      ${this.product?.name}
    </oryx-content-link>`;
  }
}
