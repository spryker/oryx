import { RouteConfig, Router } from '@lit-labs/router';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { html, ReactiveControllerHost, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import { LitRoutesRegistry } from './lit-routes-registry';

export class LitRouter extends Router {
  protected id?: string;
  protected routerService = resolve(RouterService);
  protected ssrAwaiter = resolve(SSRAwaiterService, null);

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
    this.urlSearchParams = Object.fromEntries(
      new URLSearchParams(
        decodeURIComponent(globalThis.location?.search)
      ).entries()
    );

    await super.goto(pathname);
  }
}
