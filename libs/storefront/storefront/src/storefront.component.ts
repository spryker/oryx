import { LinkType } from '@spryker-oryx/content/link';
import { ContextController } from '@spryker-oryx/core';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductContext } from '@spryker-oryx/product';
import { routes, StorefrontRouter } from '@spryker-oryx/storefront';
import { hydratable, isClient } from '@spryker-oryx/utilities';
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
    return html`
      <div>
        <content-link
          class="link"
          .options="${{ type: LinkType.RawUrl, id: '/', label: 'Home Page' }}"
          >Home</content-link
        >
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
      <nav>
        <search-box .options="{{cmsCount: 0}}"></search-box>
        <auth-logout .options="${{ customRedirect: 'contact' }}"></auth-logout>
        <mini-cart></mini-cart>
      </nav>
    `;
  }

  override render(): TemplateResult {
    return html` ${asyncValue(
      this.route$,
      () => html`<div>${this.renderNav()} ${this._routes.outlet()}</div>`
    )}`;
  }
}
