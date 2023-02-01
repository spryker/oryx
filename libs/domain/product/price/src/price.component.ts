import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { asyncState, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest, switchMap } from 'rxjs';
import { ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';

export class ProductPriceComponent extends ProductMixin(
  ContentMixin<ProductPriceOptions>(LitElement)
) {
  static styles = ProductPriceStyles;

  protected pricingService = resolve(PricingService);

  @asyncState()
  protected price = valueType(
    this.productController
      .getProductLegacy()
      .pipe(
        switchMap((product) =>
          combineLatest([
            this.pricingService.format(product?.price?.defaultPrice),
            this.pricingService.format(product?.price?.originalPrice),
          ])
        )
      )
  );

  protected override render(): TemplateResult {
    const [defaultPrice, originalPrice] = this.price ?? [];
    const options = this.componentOptions;

    return html`
      <span part=${`default${!originalPrice ? ' default-original' : ''}`}
        >${defaultPrice}</span
      >
      ${when(
        originalPrice && !options?.hideOriginal,
        () => html`<span part="original">${originalPrice}</span>`
      )}
    `;
  }
}
