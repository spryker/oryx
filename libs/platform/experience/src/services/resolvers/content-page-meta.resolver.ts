import { ElementResolver, PageMetaResolver } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, combineLatest, map } from 'rxjs';
import { ExperienceComponent, ExperienceDataService } from '../experience';

export class ContentPageMetaResolver implements PageMetaResolver {
  constructor(
    protected router = inject(RouterService),
    protected experienceDataService = inject(ExperienceDataService)
  ) {}

  protected experienceData = this.experienceDataService.getData();

  getScore(): Observable<unknown[]> {
    return combineLatest([
      this.router.currentRoute().pipe(map((route) => this.getData(route))),
    ]);
  }

  resolve(): Observable<ElementResolver> {
    return this.router.currentRoute().pipe(
      map((route) => {
        const defaultMeta = this.getData(route);
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

  protected getData(route: string): ExperienceComponent['meta'] | undefined {
    const routePath = route.split('/').filter(Boolean)[0];

    return this.experienceData.find((data) => {
      const metaPath = data.meta?.route?.split('/').filter(Boolean)[0];

      return routePath === metaPath;
    })?.meta;
  }
}
