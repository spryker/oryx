import { RouteType } from '@spryker-oryx/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models';

export interface BreadcrumbsService {
  get(qualifier?: BreadcrumbsQualifier): Observable<Breadcrumb[]>;
}

export interface BreadcrumbsResolver {
  resolve(): Observable<Breadcrumb[]>;
}

export type BreadcrumbsQualifier = {
  type: RouteType;
};

export const BreadcrumbsService = 'oryx.BreadcrumbsService';
export const BreadcrumbsResolvers = 'oryx.BreadcrumbsResolver*';

declare global {
  interface InjectionTokensContractMap {
    [BreadcrumbsService]: BreadcrumbsService;
  }
}
