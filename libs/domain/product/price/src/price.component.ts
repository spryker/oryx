import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest, switchMap } from 'rxjs';
import { ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';
export class ProductPriceComponent extends ProductComponentMixin<ProductPriceOptions>() {
  static styles = ProductPriceStyles;

  protected pricingService = resolve(PricingService);

  protected options$ = new ContentController(this).getOptions();
  protected product$ = new ProductController(this).getProduct();
  protected price$ = this.product$.pipe(
    switchMap((product) =>
      combineLatest([
        this.pricingService.format(product?.price?.defaultPrice),
        this.pricingService.format(product?.price?.originalPrice),
        this.options$,
      ])
    )
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.price$,
        ([defaultPrice, originalPrice, options]) => html`
          <span part=${`default${!originalPrice ? ' default-original' : ''}`}
            >${defaultPrice}</span
          >
          ${when(
            originalPrice && !options?.hideOriginal,
            () => html`<span part="original">${originalPrice}</span>`
          )}
        `
      )}
    `;
  }
}
