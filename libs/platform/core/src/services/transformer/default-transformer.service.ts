import { inject, INJECTOR } from '@spryker-oryx/di';
import { isPromise } from '@spryker-oryx/utilities';
import {
  from,
  isObservable,
  merge,
  Observable,
  of,
  reduce,
  switchMap,
} from 'rxjs';
import {
  InheritTransformerResult,
  SimpleTransformer,
  Transformer,
  TransformerService,
  TransformerType,
} from './transformer.service';

/**
 * Transforms data by transformer(s) callback
 */
export class DefaultTransformerService implements TransformerService {
  constructor(protected injector = inject(INJECTOR)) {}

  transform<T extends keyof InjectionTokensContractMap>(
    data: unknown,
    token: T
  ): Observable<TransformerType<T>>;
  transform<T>(
    data: unknown,
    token: keyof InjectionTokensContractMap
  ): Observable<TransformerType<T>> {
    const reducer = (fullData: unknown, currentData: unknown): unknown => {
      if (
        fullData === null ||
        Array.isArray(fullData) ||
        typeof fullData !== 'object'
      ) {
        return currentData;
      }

      return {
        ...(fullData as Record<string, unknown>),
        ...(currentData as Record<string, unknown>),
      };
    };
    const asyncData: Observable<unknown>[] = [];
    const syncData = this.getTransformers(token).reduce(
      (currentData: unknown, cb: Transformer<unknown>) => {
        let cbData = cb(data, this);

        // we assume that transformer returning a promise is a lazy-loaded transformer
        // so we need to resolve the callback and call it again
        if (isPromise(cbData)) {
          cbData = from(cbData).pipe(
            switchMap((cbFromPromise: SimpleTransformer<unknown>) => {
              const dbData = cbFromPromise(data, this);
              return isObservable(dbData) ? dbData : of(dbData);
            })
          );
        }

        if (isObservable(cbData)) {
          asyncData.push(cbData);

          return currentData;
        }

        return reducer(currentData, cbData);
      },
      null
    );

    return merge(...asyncData).pipe(reduce(reducer, syncData)) as Observable<
      TransformerType<T>
    >;
  }

  do<T extends keyof InjectionTokensContractMap>(
    token: T
  ): (source$: Observable<unknown>) => InheritTransformerResult<T> {
    return (source$) =>
      source$.pipe(switchMap((data) => this.transform<T>(data, token)));
  }

  protected getTransformers(
    token: keyof InjectionTokensContractMap
  ): Transformer[] {
    const transformer = this.injector.inject(token) as unknown as
      | Transformer
      | Transformer[];

    return Array.isArray(transformer) ? transformer : [transformer];
  }
}
