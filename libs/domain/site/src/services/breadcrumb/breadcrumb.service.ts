import { Observable } from 'rxjs';
import { BreadcrumbItem } from '../../models';

export interface BreadcrumbService {
  get(): Observable<BreadcrumbItem[]>;
}

export interface BreadcrumbResolver {
  resolve(): Observable<BreadcrumbItem[]>;
}

export const BreadcrumbService = 'oryx.BreadcrumbService';
export const BreadcrumbResolvers = 'oryx.BreadcrumbResolver*';

declare global {
  interface InjectionTokensContractMap {
    [BreadcrumbService]: BreadcrumbService;
    [BreadcrumbResolvers]: BreadcrumbResolver;
  }
}
