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

@defaultOptions({ linkType: 'none' })
@hydrate({ context: ProductContext.SKU })
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = styles;

  protected semanticLinkService = resolve(LinkService);

  protected $link = computed(() => {
    if (!this.$options().linkType || this.$options().linkType === 'none') {
      return null;
    }
    return this.semanticLinkService.get({
      type: RouteType.Product,
      id: this.$product()?.sku,
    });
  });

  protected override render(): TemplateResult | void {
    const name = this.$product()?.name;
    if (!name) return;

    return this.$link() ? this.renderLink(name) : this.renderTitle(name);
  }

  protected renderTitle(name: string): TemplateResult | void {
    const { maxLines } = this.$options();
    const style = maxLines ? `--line-clamp: ${maxLines}` : undefined;

    return html`<oryx-text
      style=${ifDefined(style)}
      .content=${this.renderTag(name)}
    ></oryx-text> `;
  }

  protected renderTag(name: string): string {
    const { tag, as, asLg, asMd, asSm } = this.$options();
    let cls: string | undefined;
    const add = (value: string) => {
      if (!cls) cls = '';
      cls += value;
    };
    if (as) add(as);
    if (asLg) add(`lg-${asLg}`);
    if (asMd) add(`lg-${asMd}`);
    if (asSm) add(`lg-${asSm}`);
    const style = cls ? `class=${cls}` : undefined;
    return `<${tag} ${style ?? ''}>${name}</${tag}>`;
  }

  protected renderLink(name: string): TemplateResult {
    const target =
      this.$options().linkType === LinkType.ExternalLink ? '_blank' : undefined;

    return html`<oryx-link>
      <a href=${this.$link()} target=${ifDefined(target)}>
        ${this.renderTitle(name)}
      </a>
    </oryx-link>`;
  }
}
