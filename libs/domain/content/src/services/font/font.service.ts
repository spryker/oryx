export interface FontService {
  install(text: string): void;
}

export const FontService = 'oryx.FontService';

declare global {
  interface InjectionTokensContractMap {
    [FontService]: FontService;
  }
}
