export const TransformerService = 'FES.TransformerService';

export interface TransformerService {
  transform<T, D = unknown>(
    data: D,
    token: keyof InjectionTokensContractMap
  ): T;
  // TODO: make it protected when service will be refactored into observables
  getTransformers(token: keyof InjectionTokensContractMap): Transformer[];
}

export type Transformer<O = unknown, I = unknown> = (
  data: I,
  transformer: TransformerService
) => O;

declare global {
  interface InjectionTokensContractMap {
    [TransformerService]: TransformerService;
  }
}
