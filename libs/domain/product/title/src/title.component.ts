import { ContentLinkOptions } from '@spryker-oryx/content/link';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import {
  computed,
  hydratable,
  SignalController,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@defaultOptions({
  linkType: 'none',
})
@hydratable(['mouseover', 'focusin'])
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = styles;

  protected singalController = new SignalController(this);

  protected hasLink = computed(
    () =>
      !!this.componentOptionsS().linkType &&
      this.componentOptionsS().linkType !== 'none'
  );

  protected override render(): TemplateResult | void {
    const { tag, as, asLg, asMd, asSm, maxLines } = this.componentOptionsS();

    return html`<oryx-heading
      .tag=${tag}
      .maxLines=${maxLines}
      .as=${as}
      .asLg=${asLg}
      .asMd=${asMd}
      .asSm=${asSm}
    >
      ${this.hasLink() ? this.renderLink() : html`${this.productS()?.name}`}
    </oryx-heading>`;
  }

  protected renderLink(): TemplateResult {
    const options = {
      type: SemanticLinkType.Product,
      id: this.productS()?.sku,
      multiLine: true,
      linkType: this.componentOptionsS().linkType,
    } as ContentLinkOptions;

    return html`<oryx-content-link .options=${options}>
      ${this.productS()?.name}
    </oryx-content-link>`;
  }
}
