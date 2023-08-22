import { Observable } from 'rxjs';
import { CmsModel, CmsQualifier } from '../../models';

export const CmsAdapter = 'oryx.CmsAdapter';

export interface CmsAdapter {
  getKey(qualifier: CmsQualifier): string;
  get<T>(qualifier?: CmsQualifier): Observable<CmsModel<T>>;
}

declare global {
  interface InjectionTokensContractMap {
    [CmsAdapter]: CmsAdapter;
  }
}
