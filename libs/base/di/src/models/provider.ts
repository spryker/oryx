import { Type } from './type';

export type Provider<T = any> =
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>
  | ExistingProvider<T>
  | AsyncClassProvider<T>;

export interface ClassProvider<T = any> {
  provide: T;
  useClass: Type<InferProviderType<T>>;
}

export interface AsyncClassProvider<T = any> {
  provide: T;
  asyncClass: () => Promise<Type<InferProviderType<T>>>;
}

export interface ValueProvider<T = any> {
  provide: T;
  useValue: InferProviderType<T>;
}

export interface FactoryProvider<T = any> {
  provide: T;
  useFactory: () => InferProviderType<T>;
}

export interface ExistingProvider<T = any> {
  provide: T;
  useExisting: keyof InjectionTokensContractMap | string;
}

export type InferProviderType<T> = T extends keyof InjectionTokensContractMap
  ? InjectionTokensContractMap[T]
  : any;
