import '@spryker-oryx/cart/mini-cart';
import { ContextController, hydratable } from '@spryker-oryx/core';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductContext } from '@spryker-oryx/product';
import { isClient } from '@spryker-oryx/typescript-utils';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { take, tap } from 'rxjs';
import { routes } from './routes';
import { StorefrontRouter } from './storefront.router';
import { styles } from './storefront.styles';

@customElement('storefront-component')
@hydratable()
export class StorefrontComponent extends LitElement {
  protected context = new ContextController(this);
  protected routerService = resolve(RouterService);
  private _routes = new StorefrontRouter(this, routes);

  static styles = styles;

  protected route$ = this.routerService.currentParams().pipe(
    tap(async (params: RouteParams) => {
      const sku = params?.sku;
      if (sku) {
        this.context.provide(ProductContext.Code, sku);
      } else {
        this.context.remove(ProductContext.Code);
      }
    })
  );

  constructor() {
    super();
    if (!isClient()) {
      // Workaround to peoperly set SKU context on the SSR
      this.route$.pipe(take(1)).subscribe();
    }
  }

  renderNav(): TemplateResult {
    return html`<nav>
      <div>
        <a href="/" aria-label="Home page">Home</a>
      </div>
      <div>
        <a href="/contact" aria-label="Contact page">Contact</a>
      </div>
      <div class="products">
        <a href="/product/139_24699831" aria-label="Product page"
          ><product-title sku="139_24699831"></product-title
        ></a>
        <a href="/product/060_24245592" aria-label="Product page"
          ><product-title sku="060_24245592"></product-title
        ></a>
        <a href="/product/010_30692994" aria-label="Product page"
          ><product-title sku="010_30692994"></product-title
        ></a>
        <mini-cart></mini-cart>
      </div>
    </nav>`;
  }

  override render(): TemplateResult {
    return html` ${asyncValue(
      this.route$,
      () => html`<div>${this.renderNav()} ${this._routes.outlet()}</div>`
    )}`;
  }
}
