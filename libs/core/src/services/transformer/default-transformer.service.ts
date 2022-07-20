import { inject, INJECTOR } from '@spryker-oryx/injector';
import { isObservable, merge, Observable, reduce } from 'rxjs';
import { Transformer, TransformerService } from './transformer.service';

/**
 * Transforms data by transformer(s) callback
 */
export class DefaultTransformerService implements TransformerService {
  constructor(protected injector = inject(INJECTOR)) {}

  transform<T, D>(
    data: D,
    token: keyof InjectionTokensContractMap
  ): Observable<T> {
    const reducer = (fullData: unknown, currentData: unknown): unknown => {
      if (
        fullData === null ||
        Array.isArray(fullData) ||
        typeof fullData !== 'object'
      ) {
        return currentData;
      }

      return {
        ...(currentData as Record<string, unknown>),
        ...(fullData as Record<string, unknown>),
      };
    };
    const asyncData: Observable<unknown>[] = [];
    const syncData = this.getTransformers(token).reduce(
      (currentData: unknown, cb: Transformer<unknown>) => {
        const cbData = cb(data, this);

        if (isObservable(cbData)) {
          asyncData.push(cbData);

          return currentData;
        }

        return reducer(currentData, cbData);
      },
      null
    );

    return merge(...asyncData).pipe(reduce(reducer, syncData)) as Observable<T>;
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
