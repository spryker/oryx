import { INJECTOR, inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, map, switchMap } from 'rxjs';
import { Breadcrumb } from '../../models';
import {
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
  BreadcrumbsService,
} from './breadcrumbs.service';

export class DefaultBreadcrumbsService implements BreadcrumbsService {
  constructor(
    protected injector = inject(INJECTOR),
    protected routerService = inject(RouterService)
  ) {}

  protected homeBreadcrumb = {
    i18n: { token: 'breadcrumbs.home' },
    url: '/',
  };

  protected getResolverKey(type: string): string {
    return `${BreadcrumbsResolvers}${type.toUpperCase()}`;
  }

  get(): Observable<Breadcrumb[]> {
    return this.routerService.current().pipe(
      switchMap((route) => {
        return this.injector
          .inject<BreadcrumbsResolver>(
            this.getResolverKey(route.type ?? 'DEFAULT'),
            this.injector.inject(this.getResolverKey('DEFAULT'))
          )
          .resolve()
          .pipe(map((breadcrumbs) => [this.homeBreadcrumb, ...breadcrumbs]));
      })
    );
  }
}
