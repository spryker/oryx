import { SSRAwaiterService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { BASE_ROUTE, RouteParams, RouterService } from '@spryker-oryx/router';
import { html, ReactiveControllerHost, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import {
  PathRouteConfig,
  RouteConfig,
  Routes,
  URLPatternRouteConfig,
} from './lit-routes';
import { LitRoutesRegistry } from './lit-routes-registry';

const origin = location.origin || location.protocol + '//' + location.host;

export class LitRouter extends Routes {
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
      // moves 404 page to the end in order not to break new provided routes
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

  override hostConnected(): void {
    super.hostConnected();
    window.addEventListener('click', this._onClick);
    window.addEventListener('popstate', this._onPopState);
    // Kick off routed rendering by going to the current URL
    this.goto(window.location.pathname);
  }

  override hostDisconnected(): void {
    super.hostDisconnected();
    window.removeEventListener('click', this._onClick);
    window.removeEventListener('popstate', this._onPopState);
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

  protected storeUrlSearchParams(): void {
    this.urlSearchParams = Object.fromEntries(
      new URLSearchParams(
        decodeURIComponent(globalThis.location?.search)
      ).entries()
    );
  }

  protected async _goto(pathname: string): Promise<void> {
    if (
      this.baseRoute &&
      (!pathname.startsWith(this.baseRoute) || pathname === this.baseRoute)
    ) {
      return;
    }

    this.storeUrlSearchParams();

    await super.goto(pathname);
  }

  private _onClick = (e: MouseEvent) => {
    const isNonNavigationClick =
      e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey;
    if (e.defaultPrevented || isNonNavigationClick) {
      return;
    }

    const anchor = e
      .composedPath()
      .find((n) => (n as HTMLElement).tagName === 'A') as
      | HTMLAnchorElement
      | undefined;
    if (
      anchor === undefined ||
      anchor.target !== '' ||
      anchor.hasAttribute('download') ||
      anchor.getAttribute('rel') === 'external'
    ) {
      return;
    }

    const href = anchor.href;
    if (href === '' || href.startsWith('mailto:')) {
      return;
    }

    const location = window.location;
    if (anchor.origin !== origin) {
      return;
    }

    e.preventDefault();
    if (href !== location.href) {
      window.history.pushState({ timestamp: new Date().getTime() }, '', href);
      this.goto(anchor.pathname);
    }
  };

  private _onPopState = (_e: PopStateEvent) => {
    if (this.routeLeaveInProgress) {
      if (this.canDisableRouteLeaveInProgress) {
        this.routeLeaveInProgress = false;
      }
      return;
    }
    this.goto(window.location.pathname);
  };
}
