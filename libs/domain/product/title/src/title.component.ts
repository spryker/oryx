import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { LinkType } from '@spryker-oryx/ui/link';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html } from 'lit/static-html.js';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@defaultOptions({
  linkType: 'none',
})
@hydrate({ context: ProductContext.SKU })
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = styles;

  protected semanticLinkService = resolve(LinkService);

  protected $link = computed(() => {
    if (!this.$options().linkType || this.$options().linkType === 'none')
      return null;

    return this.semanticLinkService.get({
      type: RouteType.Product,
      id: this.$product()?.sku,
    });
  });

  protected override render(): TemplateResult | void {
    const { tag, as, asLg, asMd, asSm, maxLines } = this.$options();

    return html`<oryx-heading
      .tag=${tag}
      .maxLines=${maxLines}
      .as=${as}
      .asLg=${asLg}
      .asMd=${asMd}
      .asSm=${asSm}
    >
      ${this.$link() ? this.renderLink() : html`${this.$product()?.name}`}
    </oryx-heading>`;
  }

  protected renderLink(): TemplateResult {
    const target =
      this.$options().linkType === LinkType.ExternalLink ? '_blank' : undefined;

    return html`<oryx-link>
      <a href=${this.$link()} target=${ifDefined(target)}>
        ${this.$product()?.name}
      </a>
    </oryx-link>`;
  }
}
