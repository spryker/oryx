import { CoreServices } from './services';

export interface SSRAwaiterContract {
  getAwaiter(): () => void;
  hasAwaiter(): boolean;
  await(): Promise<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [CoreServices.SSRAwaiter]: SSRAwaiterContract;
  }
}
