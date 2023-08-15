import { Observable } from 'rxjs';
import { Component, ExperienceCms, ExperienceQualifier } from '../../models';

export const ExperienceAdapter = 'oryx.ExperienceAdapter';

export interface ExperienceAdapter {
  getKey(qualifier: ExperienceQualifier): string;
  getCmsData(qualifier?: ExperienceQualifier): Observable<ExperienceCms | null>;
  get(qualifier: ExperienceQualifier): Observable<unknown | null>;
}

export type CmsAdapter<T = Component> = ExperienceAdapter & {
  get(qualifier: ExperienceQualifier): Observable<T | null>;
};

declare global {
  interface InjectionTokensContractMap {
    [ExperienceAdapter]: CmsAdapter;
  }
}
