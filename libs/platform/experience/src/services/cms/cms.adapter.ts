import { Observable } from 'rxjs';
import { CmsQualifier, ExperienceCms } from '../../models';

export const CmsAdapter = 'oryx.CmsAdapter';

export interface CmsAdapter {
  getKey(qualifier: CmsQualifier): string;
  get(qualifier?: CmsQualifier): Observable<ExperienceCms>;
}

declare global {
  interface InjectionTokensContractMap {
    [CmsAdapter]: CmsAdapter;
  }
}
