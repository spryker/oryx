import { Observable } from 'rxjs';
import { Component, ComponentVisibility } from './models';

export const ExperienceService = 'oryx.ExperienceService';

export interface ComponentQualifier {
  uid?: string;
  route?: string;
}

export interface ExperienceService {
  getComponent(qualifier: ComponentQualifier): Observable<Component>;
  getContent<T>({ uid }: { uid: string }): Observable<T>;
  getOptions<T>({ uid }: { uid: string }): Observable<T>;
  isHidden({ uid }: { uid: string }): Observable<ComponentVisibility>;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceService]: ExperienceService;
  }
}
