import { Observable } from 'rxjs';
import { Component } from './models';

export const ExperienceService = 'FES.ExperienceService';

export interface ExperienceService {
  getStructure({ key }: { key: string }): Observable<Component>;
  getContent<T>({ key }: { key: string }): Observable<T>;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceService]: ExperienceService;
  }
}
