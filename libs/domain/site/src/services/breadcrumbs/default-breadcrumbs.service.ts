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
  constructor(protected injector = inject(INJECTOR)) {}

  protected homeBreadcrumb = {
    i18n: { token: 'breadcrumbs.home' },
    url: '/',
  };

  protected getResolverKey(type: string): string {
    return `${BreadcrumbsResolvers}${type}`;
  }

  protected resolveType(): Observable<string | undefined> {
    return this.injector.inject(RouterService)
      .current()
      .pipe(map((route) => route.type as string | undefined));
  }

  protected mapBreadcrumbs(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    return [this.homeBreadcrumb, ...breadcrumbs];
  }

  protected resolveBreadcrumbs(type = 'DEFAULT'): Observable<Breadcrumb[]> {
    const key = this.getResolverKey(type);
    return this.injector
      .inject<BreadcrumbsResolver>(key)
      .resolve()
      .pipe(map((breadcrumbs) => this.mapBreadcrumbs(breadcrumbs)));
  }

  get(): Observable<Breadcrumb[]> {
    return this.resolveType().pipe(
      switchMap((type) => {
        try {
          if (!type) throw 'Incorrect route type!';
          return this.resolveBreadcrumbs(type.toUpperCase());
        } catch {
          //Fallback breadcrumbs
          return this.resolveBreadcrumbs();
        }
      })
    );
  }
}
