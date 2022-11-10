import { Type } from '@spryker-oryx/utilities';

export type Provider<T = any> =
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export interface ClassProvider<T = any> {
  provide: T;
  useClass: Type<InferProviderType<T>>;
}

export interface ValueProvider<T = any> {
  provide: T;
  useValue: InferProviderType<T>;
}

export interface FactoryProvider<T = any> {
  provide: T;
  useFactory: () => InferProviderType<T>;
}

export type InferProviderType<T> = T extends keyof InjectionTokensContractMap
  ? InjectionTokensContractMap[T]
  : any;
