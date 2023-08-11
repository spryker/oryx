import { Observable } from 'rxjs';
import { Component, ExperienceQualifier } from '../../models';

export const ExperienceAdapter = 'oryx.ExperienceAdapter';

export interface ExperienceAdapter {
  getKey(qualifier: ExperienceQualifier): string;
  getAll(): Observable<Component[] | null>;
  get(qualifier: ExperienceQualifier): Observable<Component | null>;
}
