import { Observable } from 'rxjs';
import { Component, ExperienceQualifier } from '../../models';

export const ExperienceAdapter = 'oryx.ExperienceAdapter';

export interface ExperienceAdapter {
  getKey(qualifier: ExperienceQualifier): string;
  get(qualifier: ExperienceQualifier): Observable<Component | null>;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceAdapter]: ExperienceAdapter;
  }
}
