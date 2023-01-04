export const MediaExperienceService = 'oryx.MediaExperienceService';

export interface MediaExperienceService {
  initialize(): void;
}

declare global {
  interface InjectionTokensContractMap {
    [MediaExperienceService]: MediaExperienceService;
  }
}
