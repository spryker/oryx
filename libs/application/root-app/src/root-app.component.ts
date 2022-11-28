import { DefaultRouter, routes } from '@spryker-oryx/application';
import { ContextController } from '@spryker-oryx/core';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { ProductContext } from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, isServer, LitElement, TemplateResult } from 'lit';
import { take, tap } from 'rxjs';
import { styles } from './root-app.styles';

@hydratable()
export class RootAppComponent extends LitElement {
  protected context = new ContextController(this);
  protected routerService = resolve(RouterService);
  private _routes = new DefaultRouter(this, routes);

  static styles = styles;

  protected route$ = this.routerService.currentParams().pipe(
    tap((params: RouteParams) => {
      this.context.provide(ProductContext.SKU, params?.sku);
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
          ${this._routes.outlet()}
          <experience-composition uid="footer"></experience-composition>`
    )}`;
  }
}
