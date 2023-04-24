import { ElementResolver, PageMetaResolver } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { combineLatest, map, Observable } from 'rxjs';
import { ExperienceStaticData, StaticComponent } from '../experience';

export class ContentPageMetaResolver implements PageMetaResolver {
  constructor(
    protected router = inject(RouterService),
    // Temporary: TODO use real mock data
    protected staticData = inject(ExperienceStaticData, []).flat()
  ) {}

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.router.currentRoute().pipe(map((route) => this.getData(route))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.router.currentRoute().pipe(
      map((route) => {
        const defaultMeta = this.getData(route);
        const meta: Record<string, string> = {
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

        return meta;
      })
    );
  }

  protected getData(route: string): StaticComponent['meta'] | undefined {
    const routePath = route.split('/').filter(Boolean)[0];

    return this.staticData.find((data) => {
      const metaPath = data.meta?.route?.split('/').filter(Boolean)[0];

      return routePath === metaPath;
    })?.meta;
  }
}
