import { Observable } from 'rxjs';

export const ExperienceDataClientService = 'oryx.ExperienceDataClientService';

export interface ExperienceDataClientService {
  initialize(): Observable<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceDataClientService]: ExperienceDataClientService;
  }
}
