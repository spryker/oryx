import { ElementResolver, PageMetaResolver } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
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
  protected getMeta$ = this.router.currentRoute().pipe(
    switchMap((route) => {
      const staticMeta = this.getData(route);

      if (staticMeta) {
        return of(staticMeta);
      }

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

  protected getData(route: string): ExperienceComponent['meta'] | undefined {
    const routePath = route.split('/').filter(Boolean)[0];

    return this.experienceData.find((data) => {
      const metaPath = data.meta?.route?.split('/').filter(Boolean)[0];

      return routePath === metaPath;
    })?.meta;
  }
}
