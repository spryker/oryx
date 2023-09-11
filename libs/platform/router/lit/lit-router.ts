/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/// <reference types="urlpattern-polyfill" />

import { SSRAwaiterService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  BASE_ROUTE,
  RouteParams,
  RouterService,
  RouteType,
} from '@spryker-oryx/router';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { html, isServer, TemplateResult } from 'lit';
import {
  isObservable,
  lastValueFrom,
  Observable,
  Subscription,
  tap,
} from 'rxjs';

import { when } from 'lit/directives/when.js';
import { LitRoutesRegistry } from './lit-routes-registry';

export interface BaseRouteConfig {
  name?: string | undefined;
  render?: (params: { [key: string]: string | undefined }) => unknown;
  enter?: (params: {
    [key: string]: string | undefined;
  }) =>
    | Promise<boolean | string>
    | Observable<boolean | string>
    | boolean
    | string;
  leave?: (params: {
    [key: string]: string | undefined;
  }) => Promise<boolean> | Observable<boolean> | boolean;
  type?: RouteType | string;
}

/**
 * A RouteConfig that matches against a `path` string. `path` must be a
 * [`URLPattern` compatible pathname pattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/pathname).
 */
export interface PathRouteConfig extends BaseRouteConfig {
  path: string;
}

/**
 * A RouteConfig that matches against a given [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
 *
 * While `URLPattern` can match against protocols, hostnames, and ports,
 * routes will only be checked for matches if they're part of the current
 * origin. This means that the pattern is limited to checking `pathname` and
 * `search`.
 */
export interface URLPatternRouteConfig extends BaseRouteConfig {
  pattern: URLPattern;
}

/**
 * A description of a route, which path or pattern to match against, and a
 * render() callback used to render a match to the outlet.
 */
export type RouteConfig = PathRouteConfig | URLPatternRouteConfig;

export const isRouterPath = (
  route: PathRouteConfig | URLPatternRouteConfig | undefined
): route is PathRouteConfig => !!(route as PathRouteConfig)?.path;

// A cache of URLPatterns created for PathRouteConfig.
// Rather than converting all given RoutConfigs to URLPatternRouteConfig, this
// lets us make `routes` mutable so users can add new PathRouteConfigs
// dynamically.
const patternCache = new WeakMap<PathRouteConfig, URLPattern>();

const isPatternConfig = (route: RouteConfig): route is URLPatternRouteConfig =>
  (route as URLPatternRouteConfig).pattern !== undefined;

const getPattern = (route: RouteConfig) => {
  if (isPatternConfig(route)) {
    return route.pattern;
  }
  let pattern = patternCache.get(route);
  if (pattern === undefined) {
    patternCache.set(
      route,
      (pattern = new URLPattern({ pathname: route.path }))
    );
  }
  return pattern;
};

/**
 * A reactive controller that performs location-based routing using a
 * configuration of URL patterns and associated render callbacks.
 */
export class LitRouter implements ReactiveController {
  private readonly _host: ReactiveControllerHost & HTMLElement;

  /*
   * The currently installed set of routes in precedence order.
   *
   * This array is mutable. To dynamically add a new route you can write:
   *
   * ```ts
   * this._routes.routes.push({
   *   path: '/foo',
   *   render: () => html`<p>Foo</p>`,
   * });
   * ```
   *
   * Mutating this property does not trigger any route transitions. If the
   * changes may result is a different route matching for the current path, you
   * must instigate a route update with `goto()`.
   */
  routes: Array<RouteConfig> = [];

  /**
   * A default fallback route which will always be matched if none of the
   * {@link routes} match. Implicitly matches to the path "/*".
   */
  fallback?: BaseRouteConfig;

  /*
   * The current set of child Routes controllers. These are connected via
   * the routes-connected event.
   */
  private readonly _childRoutes: Array<LitRouter> = [];

  private _parentRoutes: LitRouter | undefined;

  protected routeLeaveInProgress = false;
  // other popstate listeners may fire too late, so we need an additional check
  protected canDisableRouteLeaveInProgress = false;
  protected timestamp =
    globalThis.history?.state?.timestamp ?? new Date().getTime();

  /*
   * State related to the current matching route.
   *
   * We keep this so that consuming code can access current parameters, and so
   * that we can propagate tail matches to child routes if they are added after
   * navigation / matching.
   */
  private _currentPathname: string | undefined;
  private _currentRoute: RouteConfig | undefined;
  private _currentParams: {
    [key: string]: string | undefined;
  } = {};

  protected id?: string;
  protected routerService = resolve(RouterService);
  protected ssrAwaiter = resolve(SSRAwaiterService, null);

  protected urlSearchParams?: RouteParams;

  protected baseRoute?: string;
  protected subscription?: Subscription;

  /**
   * Callback to call when this controller is disconnected.
   *
   * It's critical to call this immediately in hostDisconnected so that this
   * controller instance doesn't receive a tail match meant for another route.
   */
  // TODO (justinfagnani): Do we need this now that we have a direct reference
  // to the parent? We can call `this._parentRoutes.disconnect(this)`.
  private _onDisconnect: (() => void) | undefined;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    routes: Array<RouteConfig>,
    options?: { fallback?: BaseRouteConfig }
  ) {
    routes = [
      ...resolve(LitRoutesRegistry, [])
        .map((registry) => registry.routes)
        .flat(),
      ...routes,
    ]
      // moves 404 page and other pages (/:page) to the end in order not to break new provided routes
      .sort((a) =>
        (a as PathRouteConfig).path === '/*' ||
        (a as PathRouteConfig).path === '/:page'
          ? 0
          : -1
      );

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

    (this._host = host).addController(this);

    this.routes = [...routes];
    this.fallback =
      options?.fallback ??
      this.routes.find((route) => route.type === RouteType.NotFound);

    this.routerService.setRoutes(routes);

    if (baseRoute) {
      this.baseRoute = baseRoute;
    }

    if (isServer) {
      this.subscribe();
    }
  }

  /**
   * Returns a URL string of the current route, including parent routes,
   * optionally replacing the local path with `pathname`.
   */
  link(pathname?: string): string {
    if (pathname?.startsWith('/')) {
      return pathname;
    }
    if (pathname?.startsWith('.')) {
      throw new Error('Not implemented');
    }
    pathname ??= this._currentPathname;
    return (this._parentRoutes?.link() ?? '') + pathname;
  }

  async goto(pathname: string): Promise<void> {
    await this._goto(pathname);
    this.routerService.go(pathname, {
      queryParams: this.urlSearchParams,
    });
  }

  /**
   * Navigates this routes controller to `pathname`.
   *
   * This does not navigate parent routes, so it isn't (yet) a general page
   * navigation API. It does navigate child routes if pathname matches a
   * pattern with a tail wildcard pattern (`/*`).
   */
  async _goto(pathname: string): Promise<void> {
    if (
      this.baseRoute &&
      (!pathname.startsWith(this.baseRoute) || pathname === this.baseRoute)
    ) {
      return;
    }

    this.storeUrlSearchParams();

    // TODO (justinfagnani): handle absolute vs relative paths separately.
    // TODO (justinfagnani): do we need to detect when goto() is called while
    // a previous goto() call is still pending?

    // TODO (justinfagnani): generalize this to handle query params and
    // fragments. It currently only handles path names because it's easier to
    // completely disregard the origin for now. The click handler only does
    // an in-page navigation if the origin matches anyway.

    let tailGroup: string | undefined;

    if (!globalThis.history?.state?.timestamp) {
      const timestamp = new Date().getTime();
      globalThis.history?.replaceState({ timestamp }, '');
    }

    if (this.routes.length === 0 && this.fallback === undefined) {
      // If a routes controller has none of its own routes it acts like it has
      // one route of `/*` so that it passes the whole pathname as a tail
      // match.
      tailGroup = pathname;
      this._currentPathname = '';
      // Simulate a tail group with the whole pathname
      this._currentParams = { 0: tailGroup };
    } else {
      const route = this._getRoute(pathname);
      if (route === undefined) {
        throw new Error(`No route found for ${pathname}`);
      }
      const pattern = getPattern(route);
      const result = pattern.exec({ pathname });
      const params = result?.pathname.groups ?? {};
      tailGroup = getTailGroup(params);
      const timestamp =
        globalThis.history?.state?.timestamp ?? new Date().getTime();

      if (
        typeof this._currentRoute?.leave === 'function' &&
        this._currentRoute !== route
      ) {
        this.canDisableRouteLeaveInProgress = false;
        this.routeLeaveInProgress = true;
        const direction = timestamp > this.timestamp ? -1 : 1;

        let success = this._currentRoute.leave(params);

        if (success !== true) {
          globalThis.history.go(direction);

          success = true;

          // On some browsers, history.go doesn't complete fast enough, so trying to go back with another history.go won't work.
          // So we wait for the first history.go to complete.
          const callback = async () => {
            window.removeEventListener('popstate', callback);
            if (success === false) {
              return;
            }

            await globalThis.history.go(-direction);
            this.canDisableRouteLeaveInProgress = true;
          };
          window.addEventListener('popstate', callback);
          const leaveFn = this._currentRoute.leave(params);
          success = await (isObservable(leaveFn)
            ? lastValueFrom(leaveFn)
            : leaveFn);

          // If leave() returns false, cancel this navigation
          if (success === false) {
            this.routeLeaveInProgress = false;
            return;
          }
        }
        this.timestamp = timestamp;
      } else {
        this.timestamp = timestamp;
      }

      this._currentRoute = route;
      this._currentParams = params;
      this._currentPathname =
        tailGroup === undefined
          ? pathname
          : pathname.substring(0, pathname.length - tailGroup.length);

      if (typeof route.enter === 'function') {
        const enterFn = route.enter(params);
        const result = await (isObservable(enterFn)
          ? lastValueFrom(enterFn)
          : enterFn);

        if (typeof result === 'string') {
          this.routerService.navigate(result);

          return;
        }

        // If enter() returns false, cancel this navigation
        if (result === false) {
          this.routerService.navigate('/');

          return;
        }
      }
    }

    // Propagate the tail match to children
    if (tailGroup !== undefined) {
      for (const childRoutes of this._childRoutes) {
        childRoutes.goto(tailGroup);
      }
    }
    this._host.requestUpdate();
    if (!isServer) {
      await this._host.updateComplete;
    }
  }

  /**
   * The result of calling the current route's render() callback.
   */
  outlet(): TemplateResult {
    const path = isRouterPath(this._currentRoute)
      ? this._currentParams.page
        ? `/${this._currentParams.page}`
        : this._currentRoute.path
      : '/';

    return html`<outlet>
      ${when(
        this._currentRoute?.render,
        () => this._currentRoute?.render?.(this._currentParams),
        () => html`<oryx-composition route=${path}></oryx-composition>`
      )}
    </outlet>`;
  }

  protected storeUrlSearchParams(): void {
    this.urlSearchParams = Object.fromEntries(
      new URLSearchParams(
        decodeURIComponent(globalThis.location?.search)
      ).entries()
    );
  }

  /**
   * The current parsed route parameters.
   */
  get params(): {
    [key: string]: string | undefined;
  } {
    return this._currentParams;
  }

  /**
   * Matches `url` against the installed routes and returns the first match.
   */
  private _getRoute(pathname: string): RouteConfig | undefined {
    const matchedRoute = this.routes.find((r) =>
      getPattern(r).test({ pathname: pathname })
    );

    if (matchedRoute || this.fallback === undefined) {
      return matchedRoute;
    }
    if (this.fallback) {
      // The fallback route behaves like it has a "/*" path. This is hidden from
      // the public API but is added here to return a valid RouteConfig.
      return { ...this.fallback, path: '/*' };
    }
    return undefined;
  }

  hostConnected(): void {
    this._host.addEventListener(
      RoutesConnectedEvent.eventName,
      this._onRoutesConnected as EventListener
    );
    const event = new RoutesConnectedEvent(this);
    this._host.dispatchEvent(event);
    this._onDisconnect = event.onDisconnect;

    window.addEventListener('click', this._onClick);
    window.addEventListener('popstate', this._onPopState);
    // Kick off routed rendering by going to the current URL
    this.goto(window.location.pathname);

    this.subscribe();
  }

  hostDisconnected(): void {
    // When this child routes controller is disconnected because a parent
    // outlet rendered a different template, disconnecting will ensure that
    // this controller doesn't receive a tail match meant for another route.
    this._onDisconnect?.();
    this._parentRoutes = undefined;

    window.removeEventListener('click', this._onClick);
    window.removeEventListener('popstate', this._onPopState);

    this.subscription?.unsubscribe();
  }

  protected subscribe = (): void => {
    this.subscription = this.routerService
      .currentRoute()
      .pipe(
        tap(async (route) => {
          if (route !== '') {
            const resolve = this.ssrAwaiter?.getAwaiter();
            this.routerService.acceptParams(this.params);
            await this._goto(route);
            resolve?.();
          }
        })
      )
      .subscribe();
  };

  private _onRoutesConnected = (e: RoutesConnectedEvent) => {
    // Don't handle the event fired by this routes controller, which we get
    // because we do this.dispatchEvent(...)
    if (e.routes === this) {
      return;
    }

    const childRoutes = e.routes;
    this._childRoutes.push(childRoutes);
    childRoutes._parentRoutes = this;

    e.stopImmediatePropagation();
    e.onDisconnect = () => {
      // Remove route from this._childRoutes:
      // `>>> 0` converts -1 to 2**32-1
      this._childRoutes?.splice(
        this._childRoutes.indexOf(childRoutes) >>> 0,
        1
      );
    };

    const tailGroup = getTailGroup(this._currentParams);
    if (tailGroup !== undefined) {
      childRoutes.goto(tailGroup);
    }
  };

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

/**
 * Returns the tail of a pathname groups object. This is the match from a
 * wildcard at the end of a pathname pattern, like `/foo/*`
 */
const getTailGroup = (groups: { [key: string]: string | undefined }) => {
  let tailKey: string | undefined;
  for (const key of Object.keys(groups)) {
    if (/\d+/.test(key) && (tailKey === undefined || key > tailKey!)) {
      tailKey = key;
    }
  }
  return tailKey && groups[tailKey];
};

/**
 * This event is fired from Routes controllers when their host is connected to
 * announce the child route and potentially connect to a parent routes controller.
 */
export class RoutesConnectedEvent extends Event {
  static readonly eventName = 'lit-routes-connected';
  readonly routes: LitRouter;
  onDisconnect?: () => void;

  constructor(routes: LitRouter) {
    super(RoutesConnectedEvent.eventName, {
      bubbles: true,
      composed: true,
      cancelable: false,
    });
    this.routes = routes;
  }
}

declare global {
  interface HTMLElementEventMap {
    [RoutesConnectedEvent.eventName]: RoutesConnectedEvent;
  }
}
