import { PageMetaResolverService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { Breadcrumb } from '../../models';
import { BreadcrumbsResolver, BreadcrumbsResolvers } from '../breadcrumbs';

export class DefaultFallbackBreadcrumbsResolver implements BreadcrumbsResolver {
  constructor(protected pageMetaService = inject(PageMetaResolverService)) {}

  resolve(): Observable<Breadcrumb[]> {
    return this.pageMetaService.getTitle().pipe(map((text) => [{ text }]));
  }
}

export const FallbackBreadcrumbsResolver = `${BreadcrumbsResolvers}fallback`;
