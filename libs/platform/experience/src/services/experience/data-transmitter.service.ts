export const DataTransmitterService = 'oryx.DataTransmitterService';

export interface DataTransmitterService {
  initialize(): void;
}

declare global {
  interface InjectionTokensContractMap {
    [DataTransmitterService]: DataTransmitterService;
  }
}
