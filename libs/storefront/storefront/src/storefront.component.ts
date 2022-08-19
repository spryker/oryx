import { LinkType } from '@spryker-oryx/content/link';
import { ContextController, hydratable } from '@spryker-oryx/core';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductContext } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { routes, StorefrontRouter } from '@spryker-oryx/storefront';
import { isClient } from '@spryker-oryx/typescript-utils';
import { html, LitElement, TemplateResult } from 'lit';
import { take, tap } from 'rxjs';
import { styles } from './storefront.styles';

@hydratable()
export class StorefrontComponent extends LitElement {
  protected context = new ContextController(this);
  protected routerService = resolve(RouterService);
  private _routes = new StorefrontRouter(this, routes);

  static styles = styles;

  protected route$ = this.routerService.currentParams().pipe(
    tap((params: RouteParams) => {
      this.context.provide(ProductContext.SKU, params?.sku);
    })
  );

  constructor() {
    super();
    if (!isClient()) {
      // Workaround to properly set SKU context on the SSR
      this.route$.pipe(take(1)).subscribe();
    }
  }

  renderNav(): TemplateResult {
    return html`<nav>
      <div>
        <content-link
          class="link"
          .options="${{ type: LinkType.RawUrl, id: '/', label: 'Home Page' }}"
          >Home</content-link
        >
      </div>
      <div>
        <content-link
          class="link"
          .options="${{
            type: LinkType.RawUrl,
            id: '/contact',
            label: 'Contact Page',
          }}"
          >Contact</content-link
        >
      </div>
      <div class="products">
        <content-link
          class="link"
          .options="${{
            type: SemanticLinkType.Product,
            id: '001_25904006',
            label: 'Product page',
          }}"
          ><product-title sku="001_25904006"></product-title
        ></content-link>
        <content-link
          class="link"
          .options="${{
            type: SemanticLinkType.Product,
            id: '139_24699831',
            label: 'Product page',
          }}"
          ><product-title sku="139_24699831"></product-title
        ></content-link>
        <content-link
          class="link"
          .options="${{
            type: SemanticLinkType.Product,
            id: '060_24245592',
            label: 'Product page',
          }}"
          ><product-title sku="060_24245592"></product-title
        ></content-link>
        <content-link
          class="link"
          .options="${{
            type: SemanticLinkType.Product,
            id: '010_30692994',
            label: 'Product page',
          }}"
          ><product-title sku="010_30692994"></product-title
        ></content-link>
        <user-logout .options="${{ customRedirect: 'contact' }}"></user-logout>
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
