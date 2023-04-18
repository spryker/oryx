import { OnDestroy } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { AppInitializer } from '../../app-initializer';
import { ElementDefinition } from '../page-meta.model';

export const PageMetaResolverService = 'oryx.PageMetaResolverService';
export const PageMetaResolver = 'oryx.PageMetaResolver*';

export interface ElementResolver extends Partial<ElementDefinition> {
  link?: string;
  style?: string;
  script?: string;
  title?: string;
  id?: string;
}

export interface PageMetaResolverService extends AppInitializer, OnDestroy {
  getTitle(): Observable<string | undefined>;
}

export interface PageMetaResolver {
  getScore(): Observable<number>;
  resolve(): Observable<ElementResolver | ElementResolver[]>;
}

declare global {
  interface InjectionTokensContractMap {
    [PageMetaResolverService]: PageMetaResolverService;
    [PageMetaResolver]: PageMetaResolver;
  }
}
