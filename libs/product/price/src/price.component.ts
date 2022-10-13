import { ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest, switchMap } from 'rxjs';
import { ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';
export class ProductPriceComponent extends ProductComponentMixin<ProductPriceOptions>() {
  static styles = ProductPriceStyles;

  protected productController = new ProductController(this);

  protected pricingService = resolve(PricingService);

  protected options$ = new ContentController(this).getOptions();
  protected price$ = combineLatest([
    this.options$,
    this.productController.getProduct(),
  ]).pipe(
    switchMap(([options, product]) =>
      combineLatest([
        this.pricingService.format(product?.price?.defaultPrice),
        this.pricingService.format(
          !options?.hideOriginal ? product?.price?.originalPrice : undefined
        ),
      ])
    )
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.price$,
        ([defaultPrice, originalPrice]) => html`
          ${defaultPrice}
          ${when(
            originalPrice,
            () => html`<span part="original">${originalPrice}</span>`
          )}
        `
      )}
    `;
  }
}
