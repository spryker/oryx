import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { JsonLdNormalizer } from '@spryker-oryx/site';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { combineLatest } from 'rxjs';
import { PRODUCT, ProductJsonLdNormalizers, ProductMixin } from '../src';

@hydrate({ context: PRODUCT })
export class ProductJsonLdComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  protected productJsonLdNormalizers = resolve(ProductJsonLdNormalizers);

  protected $schemas = computed(() => {
    const product = this.$product();
    if (!product) return [];

    return combineLatest(
      this.productJsonLdNormalizers.map((normalizer: JsonLdNormalizer) =>
        normalizer.normalize(product)
      )
    );
  });

  protected override render(): TemplateResult | void {
    const schemas = this.$schemas();

    return html`${unsafeHTML(`
      <script type="application/ld+json">
        ${JSON.stringify(schemas)}
      </script>
    `)}`;
  }
}
