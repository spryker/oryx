import { resolve } from '@spryker-oryx/di';
import { LayoutMixin } from '@spryker-oryx/experience';
import {
  AlternativeProductsListService,
  ProductMixin,
} from '@spryker-oryx/product';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { of } from 'rxjs';

@hydratable()
export class ReferencesComponent extends ProductMixin(LayoutMixin(LitElement)) {
  protected alternativeProductsListService = resolve(
    AlternativeProductsListService
  );

  protected list = computed(() => {
    return this.$product()?.sku
      ? this.alternativeProductsListService.get(this.$product()!.sku!)
      : of(undefined);
  });

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this.list() || [],
        (p) => p.sku,
        (p) => html`<oryx-product-card .sku=${p.sku}></oryx-product-card>`
      )}
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }
}
