import { OnDestroy } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { AppInitializer } from '../../app-initializer';
import { ElementResolver, ResolverScore } from './page-meta-resolver.model';

export const PageMetaResolverService = 'oryx.PageMetaResolverService';
export const PageMetaResolver = 'oryx.PageMetaResolver*';

export interface PageMetaResolverService extends AppInitializer, OnDestroy {
  getTitle(): Observable<string | undefined>;
}

export interface PageMetaResolver {
  getScore(): Observable<ResolverScore | number>;
  resolve(): Observable<ElementResolver | ElementResolver[]>;
}

declare global {
  interface InjectionTokensContractMap {
    [PageMetaResolverService]: PageMetaResolverService;
    [PageMetaResolver]: PageMetaResolver;
  }
}
