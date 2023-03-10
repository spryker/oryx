import { RouteConfig, Router } from '@lit-labs/router';
import { SSRAwaiterService, SsrOptions } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { html, ReactiveControllerHost, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import { LitRoutesRegistry } from './lit-routes-registry';

export class LitRouter extends Router {
  protected id?: string;
  protected routerService = resolve(RouterService);
  protected ssrAwaiter = resolve(SSRAwaiterService, null);
  protected ssrOptions = resolve(SsrOptions, {} as SsrOptions);
  protected ssrRendered = false;

  // globalThis.location.pathname alternative to private _currentRoute is updated too early
  protected currentPath?: string;
  protected urlSearchParams?: RouteParams;

  constructor(
    protected host: ReactiveControllerHost & HTMLElement,
    routes: RouteConfig[]
  ) {
    routes = [
      ...resolve(LitRoutesRegistry, [])
        .map((registry) => registry.routes)
        .flat(),
      ...routes,
    ];
    super(host, routes);
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

  async _goto(pathname: string): Promise<void> {
    this.currentPath = globalThis.location?.pathname;
    this.urlSearchParams = Object.fromEntries(
      new URLSearchParams(
        decodeURIComponent(globalThis.location?.search)
      ).entries()
    );

    await super.goto(pathname);
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
}
