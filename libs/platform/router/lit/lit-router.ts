import { PathRouteConfig, RouteConfig, Router } from '@lit-labs/router';
import { URLPatternRouteConfig } from '@lit-labs/router/routes';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { BASE_ROUTE, RouteParams, RouterService } from '@spryker-oryx/router';
import { html, ReactiveControllerHost, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import { LitRoutesRegistry } from './lit-routes-registry';

export class LitRouter extends Router {
  protected id?: string;
  protected routerService = resolve(RouterService);
  protected ssrAwaiter = resolve(SSRAwaiterService, null);

  protected urlSearchParams?: RouteParams;

  protected baseRoute?: string;

  constructor(
    protected host: ReactiveControllerHost & HTMLElement,
    routes: RouteConfig[]
  ) {
    routes = [
      ...resolve(LitRoutesRegistry, [])
        .map((registry) => registry.routes)
        .flat(),
      ...routes,
    ].sort((a) => {
      // moves 404 page to the end in order not to broke new provided routes
      if ((a as PathRouteConfig).path === '/*') {
        return 0;
      }

      return -1;
    });

    const baseRoute = resolve(BASE_ROUTE, null);
    if (baseRoute) {
      routes = routes.map((route) => {
        if ((route as PathRouteConfig).path) {
          return {
            ...route,
            path: baseRoute + (route as PathRouteConfig).path,
          };
        }

        if ((route as URLPatternRouteConfig).pattern) {
          const oldPattern = (route as URLPatternRouteConfig).pattern;
          const pattern = new URLPattern({
            protocol: oldPattern.protocol,
            username: oldPattern.username,
            password: oldPattern.password,
            hostname: oldPattern.hostname,
            port: oldPattern.port,
            pathname: baseRoute + oldPattern.pathname,
            search: oldPattern.search,
            hash: oldPattern.hash,
          });

          return { ...route, pattern };
        }

        return route;
      });
    }

    super(host, routes);

    if (baseRoute) {
      this.baseRoute = baseRoute;
    }

    this.routerService
      .currentRoute()
      .pipe(
        tap(async (route) => {
          if (route !== '') {
            const resolve = this.ssrAwaiter?.getAwaiter();
            await this._goto(route);
            this.routerService.acceptParams(this.params);
            resolve?.();
          }
        })
      )
      .subscribe();
  }

  override async goto(pathname: string): Promise<void> {
    await this._goto(pathname);
    this.routerService.go(pathname, {
      queryParams: this.urlSearchParams,
    });
  }

  override outlet(): TemplateResult {
    return html`<outlet>${super.outlet()}</outlet>`;
  }

  protected async _goto(pathname: string): Promise<void> {
    if (
      this.baseRoute &&
      (!pathname.startsWith(this.baseRoute) || pathname === this.baseRoute)
    ) {
      return;
    }

    this.urlSearchParams = Object.fromEntries(
      new URLSearchParams(
        decodeURIComponent(globalThis.location?.search)
      ).entries()
    );

    await super.goto(pathname);
  }
}
