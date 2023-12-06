import { ssrAwaiter } from '@spryker-oryx/core/utilities';
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
    text: { token: 'breadcrumb.home' },
    url: '/',
  };

  protected getResolverKey(type = 'fallback'): string {
    return `${BreadcrumbResolvers}${type}`;
  }

  get(): Observable<BreadcrumbItem[]> {
    return this.routerService.current().pipe(
      switchMap((route) => {
        const resolver = this.injector.inject<BreadcrumbResolver>(
          this.getResolverKey(route.type),
          this.injector.inject(this.getResolverKey())
        );

        return ssrAwaiter(resolver.resolve()).pipe(
          map((breadcrumb) => [this.homeBreadcrumb, ...breadcrumb])
        );
      })
    );
  }
}
