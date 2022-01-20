import { Observable } from 'rxjs';
import { Services } from '../services';
import { Component } from './models';

export interface ExperienceContract {
  getStructure({ key }: { key: string }): Observable<Component>;
  getContent<T>({ key }: { key: string }): Observable<T>;
}

declare global {
  interface InjectionTokensContractMap {
    [Services.Experience]: ExperienceContract;
  }
}
