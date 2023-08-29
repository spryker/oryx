import { PageMetaResolverService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { BreadcrumbItem } from '../../models';
import { BreadcrumbResolver, BreadcrumbResolvers } from '../breadcrumb';

export class DefaultFallbackBreadcrumbResolver implements BreadcrumbResolver {
  constructor(protected pageMetaService = inject(PageMetaResolverService)) {}

  resolve(): Observable<BreadcrumbItem[]> {
    return this.pageMetaService.getTitle().pipe(map((text) => [{ text }]));
  }
}

export const FallbackBreadcrumbResolver = `${BreadcrumbResolvers}fallback`;
