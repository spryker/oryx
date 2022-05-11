export const SSRAwaiterService = 'FES.SSRAwaiterService';

export interface SSRAwaiterService {
  getAwaiter(): () => void;
  hasAwaiter(): boolean;
  await(): Promise<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [SSRAwaiterService]: SSRAwaiterService;
  }
}
