import { Observable } from 'rxjs';
import { StaticComponent } from '../static-data';

export const ExperienceDataClientService = 'oryx.ExperienceDataClientService';

export interface ExperienceDataClientService {
  initialize(): Observable<unknown>;
  sendStatic(data: StaticComponent[]): void;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceDataClientService]: ExperienceDataClientService;
  }
}
