import { INJECTOR, inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { Observable, map, switchMap } from 'rxjs';
import { BreadcrumbItem } from '../../models';
import {
  BreadcrumbResolver,
  BreadcrumbResolvers,
  BreadcrumbService,
} from './breadcrumb.service';

export class DefaultBreadcrumbService implements BreadcrumbService {
  constructor(
    protected injector = inject(INJECTOR),
    protected routerService = inject(RouterService)
  ) {}

  protected homeBreadcrumb = {
    i18n: { token: 'breadcrumb.home' },
    url: '/',
  };

  protected getResolverKey(type = 'fallback'): string {
    return `${BreadcrumbResolvers}${type}`;
  }

  get(): Observable<BreadcrumbItem[]> {
    return this.routerService.current().pipe(
      switchMap((route) => {
        return this.injector
          .inject<BreadcrumbResolver>(
            this.getResolverKey(route.type),
            this.injector.inject(this.getResolverKey())
          )
          .resolve()
          .pipe(map((breadcrumb) => [this.homeBreadcrumb, ...breadcrumb]));
      })
    );
  }
}
