import { PageMetaResolverService } from '@spryker-oryx/core';
import { INJECTOR, Provider, inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { Breadcrumb } from '../../models';
import { BreadcrumbsResolver, BreadcrumbsResolvers } from '../breadcrumbs';

export class DefaultBreadcrumbsResolver implements BreadcrumbsResolver {
  constructor(protected injector = inject(INJECTOR)) {}
  
  resolve(): Observable<Breadcrumb[]> {
    return this.injector.inject(PageMetaResolverService).getTitle().pipe(map((text) => [{ text }]));
  }
}

export const DefaultBreadcrumbs: Provider = {
  provide: `${BreadcrumbsResolvers}DEFAULT`,
  useClass: DefaultBreadcrumbsResolver,
};
