import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models';

export interface BreadcrumbsService {
  get(): Observable<Breadcrumb[]>;
}

export const BreadcrumbsService = 'oryx.BreadcrumbsService';

declare global {
  interface InjectionTokensContractMap {
    [BreadcrumbsService]: BreadcrumbsService;
  }
}
