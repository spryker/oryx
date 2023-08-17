import { PageMetaResolverService } from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import {
  Breadcrumb,
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
} from '@spryker-oryx/site';
import { Observable, map } from 'rxjs';

export class DefaultBreadcrumbsResolver implements BreadcrumbsResolver {
  protected pageMetaResolver = resolve(PageMetaResolverService);

  resolve(): Observable<Breadcrumb[]> {
    return this.pageMetaResolver.getTitle().pipe(map((text) => [{ text }]));
  }
}

export const DefaultBreadcrumbs: Provider = {
  provide: `${BreadcrumbsResolvers}DEFAULT`,
  useClass: DefaultBreadcrumbsResolver,
};
