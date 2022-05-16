export const SSRStreamParserService = 'FES.SSRStreamParserService';

export interface SSRStreamParserService {
  fillStream(stream: string): void;
  getStreamStack(): Record<string, string>[];
}

declare global {
  interface InjectionTokensContractMap {
    [SSRStreamParserService]: SSRStreamParserService;
  }
}
