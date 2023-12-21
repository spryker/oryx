import { ElementResolver, PageMetaResolver } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouteWithParams, RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import {
  ExperienceComponent,
  ExperienceDataService,
  ExperienceService,
} from '../experience';

export class ContentPageMetaResolver implements PageMetaResolver {
  constructor(
    protected router = inject(RouterService),
    protected experienceDataService = inject(ExperienceDataService),
    protected experienceService = inject(ExperienceService)
  ) {}

  protected experienceData = this.experienceDataService.getData();
  protected getMeta$ = this.router.current().pipe(
    switchMap((routeConfig) => {
      const staticMeta = this.getData(routeConfig);

      if (staticMeta) {
        return of(staticMeta);
      }

      //routeConfig can be PathRouteConfig or URLPatternRouteConfig
      const route =
        'path' in routeConfig
          ? routeConfig.path
          : routeConfig?.pattern?.pathname;

      return (
        this.experienceService
          .getComponent({ route })
          .pipe(map((page) => page.meta)) ?? null
      );
    })
  );

  getScore(): Observable<unknown[]> {
    return combineLatest([this.getMeta$]);
  }

  resolve(): Observable<ElementResolver> {
    return this.getMeta$.pipe(
      map((defaultMeta) => {
        const meta = {
          ...defaultMeta,
        };

        for (const by of ['follow', 'index']) {
          if (typeof meta?.[by] !== 'boolean') {
            continue;
          }

          const content = meta?.[by] ? by : `no${by}`;

          if (meta.robots) {
            meta.robots = `${meta.robots},${content}`;

            continue;
          }

          meta.robots = content;
        }

        delete meta.route;
        delete meta.follow;
        delete meta.index;

        return meta as Record<string, string>;
      })
    );
  }

  /** @deprecated since 1.4. use RouteWithParams as parameter  */
  protected getData(route: string): ExperienceComponent['meta'] | undefined;
  protected getData(
    route: RouteWithParams
  ): ExperienceComponent['meta'] | undefined;
  protected getData(
    route: RouteWithParams | string
  ): ExperienceComponent['meta'] | undefined {
    if (typeof route === 'string') {
      const routePath = route.split('/').filter(Boolean)[0];

      return this.experienceData.find((data) => {
        // support for routes being either a string or an array of strings
        const routes = Array.isArray(data.meta?.route)
          ? data.meta?.route
          : [data.meta?.route];

        return routes?.some((route) => {
          const metaPath = route?.split('/').filter(Boolean)[0];
          return routePath === metaPath;
        });
      })?.meta;
    }

    return this.experienceData.find(
      ({ meta }) => meta?.routeType === route.type
    )?.meta;
  }
}
