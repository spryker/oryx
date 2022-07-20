import { TransformerService } from '../transformer.service';

export const JsonAPITransformerService = 'FES.JsonAPITransformerService';

declare global {
  interface InjectionTokensContractMap {
    [JsonAPITransformerService]: TransformerService;
  }
}
