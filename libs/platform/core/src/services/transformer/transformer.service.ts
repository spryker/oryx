import { Observable, ObservedValueOf } from 'rxjs';

export const TransformerService = 'oryx.TransformerService';

export type TransformerType<T> = T extends keyof InjectionTokensContractMap
  ? InjectionTokensContractMap[T] extends
      | Transformer<infer I>[]
      | Transformer<infer I>
    ? I
    : unknown
  : T;

export type SerializerType<T> = T extends keyof InjectionTokensContractMap
  ? InjectionTokensContractMap[T] extends
      | Serializer<infer I>[]
      | Serializer<infer I>
    ? I
    : unknown
  : T;

export type InheritTransformerResult<T> = Observable<
  ObservedValueOf<Observable<TransformerType<T>>>
>;

export interface TransformerService {
  transform<T extends keyof InjectionTokensContractMap>(
    data: unknown,
    token: T
  ): Observable<TransformerType<T>>;
  transform<T>(
    data: unknown,
    token: keyof InjectionTokensContractMap
  ): Observable<TransformerType<T>>;
  transform<T extends keyof InjectionTokensContractMap>(
    data: unknown,
    token: T
  ): InheritTransformerResult<T>;
  transform<T>(
    data: unknown,
    token: keyof InjectionTokensContractMap
  ): InheritTransformerResult<T>;
  transform<T>(data: unknown, token: string): T;

  do<T extends keyof InjectionTokensContractMap>(
    token: T
  ): (source$: Observable<unknown>) => InheritTransformerResult<T>;
  do<T>(token: string): (source$: Observable<unknown>) => Observable<T>;
}

export type SimpleTransformer<O = unknown, I = unknown> = (
  data: I,
  transformer: TransformerService
) => O | Observable<O>;
export type LazyTransformer<O = unknown, I = unknown> = () => Promise<
  SimpleTransformer<O, I>
>;
export type ClassTransformer<O = unknown, I = unknown> = {
  transform(data: I): Observable<Partial<O> | undefined>;
};

export type Transformer<O = unknown, I = unknown> =
  | SimpleTransformer<O, I>
  | LazyTransformer<O, I>;
/** TODO: Fix, blocked by "union type that is too complex to represent" on DefaultJsonAPITransformerService */
// | ClassTransformer<O, I>;

export type Serializer<I = unknown, O = unknown> = Transformer<O, I>;

declare global {
  interface InjectionTokensContractMap {
    [TransformerService]: TransformerService;
  }
}
