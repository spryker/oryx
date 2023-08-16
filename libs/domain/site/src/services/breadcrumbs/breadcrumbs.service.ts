import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models';

export interface BreadcrumbsService {
  get(): Observable<Breadcrumb[]>;
}

export interface BreadcrumbsResolver {
  resolve(): Observable<Breadcrumb[]>;
}

export const BreadcrumbsService = 'oryx.BreadcrumbsService';
export const BreadcrumbsResolvers = 'oryx.BreadcrumbsResolver*';

declare global {
  interface InjectionTokensContractMap {
    [BreadcrumbsService]: BreadcrumbsService;
  }
}
