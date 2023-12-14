import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { LinkType } from '@spryker-oryx/ui/link';
import {
  computed,
  featureVersion,
  hydrate,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html } from 'lit/static-html.js';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@ssrShim('style')
@hydrate({ context: ProductContext.SKU })
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = featureVersion >= '1.4' ? undefined : styles;

  protected semanticLinkService = resolve(LinkService);

  protected $link = computed(() => {
    if (!this.$options().linkType || this.$options().linkType === 'none') {
      return null;
    }
    return this.semanticLinkService.get({
      type: RouteType.Product,
      id: featureVersion <= '1.4' ? this.$product()?.sku : undefined,
      qualifier: this.$productQualifier(),
    });
  });

  protected override render(): TemplateResult | void {
    const title = this.$product()?.name;
    if (!title) return;

    const { linkType, ...options } = this.$options();

    return html`<oryx-heading
      .tag=${options.tag}
      .typography=${options.typography}
      .sm=${options.sm}
      .md=${options.md}
      .lg=${options.lg}
      .maxLines=${options.maxLines}
      >${!linkType || linkType === 'none'
        ? title
        : this.renderLink(title)}</oryx-heading
    >`;
  }

  protected renderLink(template?: TemplateResult | string): TemplateResult {
    const target =
      this.$options().linkType === LinkType.ExternalLink ? '_blank' : undefined;
    if (!template) template = html`${this.$product()?.name}`;
    return html`<oryx-link>
      <a href=${this.$link()} target=${ifDefined(target)}>${template}</a>
    </oryx-link>`;
  }
}
