import { RouteConfig, Router } from '@lit-labs/router';
import { SSRAwaiterService, SsrOptions } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { PatchableLitElement } from '@spryker-oryx/utilities';
import { html, isServer, ReactiveControllerHost, TemplateResult } from 'lit';
import { identity, skip, tap } from 'rxjs';
import { LitRoutesRegistry } from './lit-routes-registry';

export class LitRouter extends Router {
  protected id?: string;
  protected routerService = resolve(RouterService);
  protected ssrAwaiter = resolve(SSRAwaiterService, null);
  protected ssrOptions = resolve(SsrOptions, {} as SsrOptions);
  protected ssrRendered = false;
  // TODO - @lit-labs/router does not expose _host. If they do, we will prefer it over this.
  protected readonly host: ReactiveControllerHost & HTMLElement;

  // globalThis.location.pathname alternative to private _currentRoute is updated too early
  protected currentPath?: string;
  protected urlSearchParams?: RouteParams;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    routes: RouteConfig[]
  ) {
    routes = [
      ...resolve(LitRoutesRegistry, [])
        .map((registry) => registry.routes)
        .flat(),
      ...routes,
    ];

    super(host, routes);
    this.host = host;
    this.ssrRendered =
      !isServer && !!host.shadowRoot && !this.ssrOptions.initialNavigation;
    this.routerService
      .currentRoute()
      .pipe(
        this.ssrRendered
          ? (skip(1),
            tap(
              (route) =>
                route !== '' && this.routerService.acceptParams(this.params)
            ))
          : identity,
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

    // As part of the lazy hydration strategy, everything should not be hydrated by default
    // If the host component is SSR rendered, hydrating it wipes everything
    // So none of the previously SSRed sub components will remain
    // This should only happen when someone actually clicks on a link; not during page load
    if (
      this.ssrRendered &&
      (this.host as unknown as PatchableLitElement)._$needsHydration
    ) {
      return;
    }

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
