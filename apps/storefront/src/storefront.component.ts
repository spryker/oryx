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
        // TODO: Revert when EB editing will work for PDP
        // this.context.remove(ProductContext.Code);
        this.context.provide(ProductContext.Code, '139_24699831');
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
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/contact">Contact</a>
      </li>
      <li class="products">
        <a href="/product/139_24699831"
          ><product-title sku="139_24699831"></product-title
        ></a>
        <a href="/product/060_24245592"
          ><product-title sku="060_24245592"></product-title
        ></a>
        <a href="/product/010_30692994"
          ><product-title sku="010_30692994"></product-title
        ></a>
      </li>
    </nav>`;
  }

  override render(): TemplateResult {
    return html` ${asyncValue(
      this.route$,
      () => html`<div>${this.renderNav()} ${this._routes.outlet()}</div>`
    )}`;
  }
}
