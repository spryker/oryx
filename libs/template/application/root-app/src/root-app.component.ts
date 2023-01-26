import { CheckoutContext } from '@spryker-oryx/checkout';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ProductContext } from '@spryker-oryx/product';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { LitRouter } from '@spryker-oryx/router/lit';
import { asyncValue, hydratable } from '@spryker-oryx/utilities';
import { html, isServer, LitElement, TemplateResult } from 'lit';
import { take, tap } from 'rxjs';
import { styles } from './root-app.styles';

@hydratable()
export class RootAppComponent extends LitElement {
  protected context = new ContextController(this);
  protected routerService = resolve(RouterService);
  private _router = new LitRouter(this, []);

  static styles = styles;

  protected route$ = this.routerService.currentParams().pipe(
    tap((params: RouteParams) => {
      this.context.provide(ProductContext.SKU, params?.sku);
      this.context.provide(CheckoutContext.OrderId, params?.id);
    })
  );

  constructor() {
    super();
    if (isServer) {
      // Workaround to properly set SKU context on the SSR
      this.route$.pipe(take(1)).subscribe();
    }
  }

  override render(): TemplateResult {
    return html` ${asyncValue(
      this.route$,
      () =>
        html`<experience-composition uid="header"></experience-composition>
          ${this._router.outlet()}
          <experience-composition uid="footer"></experience-composition>`
    )}`;
  }
}
