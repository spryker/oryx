import { RouteConfig } from '@lit-labs/router';
import { OauthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LitRouter } from '@spryker-oryx/router/lit';
import { subscribe } from '@spryker-oryx/utilities';
import { LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { combineLatest, tap } from 'rxjs';
import { styles } from './fulfillment-root.styles';

export class FulfillmentRootComponent extends LitElement {
  static styles = styles;

  @property({ type: Array }) declare extraRoutes?: RouteConfig[];

  router = new LitRouter(this, this.extraRoutes ?? []);

  constructor(
    protected authService = resolve(OauthService),
    protected routerService = resolve(RouterService)
  ) {
    super();
  }

  @subscribe()
  protected guard$ = combineLatest([
    this.authService.isAuthenticated(),
    this.routerService.currentRoute(),
  ]).pipe(
    tap(([authenticated, currentRoute]) => {
      if (
        !authenticated &&
        currentRoute !== '/login' &&
        !currentRoute.startsWith('/oauth')
      ) {
        this.authService.login();
      }
      if (
        authenticated &&
        (currentRoute.startsWith('/login') || currentRoute.startsWith('/oauth'))
      ) {
        this.routerService.navigate('/');
      }
    })
  );

  protected override render(): unknown {
    return this.router.outlet();
  }

  protected willUpdate(
    changedProps: PropertyValueMap<FulfillmentRootComponent>
  ): void {
    if (
      changedProps.has('extraRoutes') &&
      changedProps.get('extraRoutes') !== this.extraRoutes &&
      this.extraRoutes
    ) {
      // Remove old routes
      changedProps.get('extraRoutes')?.forEach((oldRoute) => {
        const idx = this.router.routes.indexOf(oldRoute);
        if (idx !== -1) {
          this.router.routes.splice(idx, 1);
        }
      });

      // Add new routes
      this.router.routes.push(...this.extraRoutes);
    }
  }
}

export default FulfillmentRootComponent;
