export const SSRAwaiterService = 'oryx.SSRAwaiterService';

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
