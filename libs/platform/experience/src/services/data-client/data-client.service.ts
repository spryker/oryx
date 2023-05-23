import { Observable } from 'rxjs';

export const ExperienceDataClientService = 'oryx.ExperienceDataClientService';
export const ExperienceDataRevealer = 'oryx.ExperienceDataRevealer*';

export interface ExperienceDataClientService {
  initialize(): Observable<unknown>;
}

export interface ExperienceDataRevealer {
  reveal(): Observable<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [ExperienceDataClientService]: ExperienceDataClientService;
    [ExperienceDataRevealer]: ExperienceDataRevealer;
  }
}
