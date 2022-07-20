import { inject } from '@spryker-oryx/injector';
import { Deserializer } from 'jsonapi-serializer';
import { Observable, switchMap } from 'rxjs';
import { ssrAwaiter } from '../../../utilities';
import { TransformerService } from '../transformer.service';

/**
 * Deserializes json response. Combines relationships, includes into one data (transforms include key e.g. 'include-example' into camelCase e.g 'includeExample').
 */
export class DefaultJsonAPITransformerService implements TransformerService {
  protected deserializer = new Deserializer({
    keyForAttribute: 'camelCase',
  });

  constructor(protected transformer = inject(TransformerService)) {}

  transform<T, D>(
    data: D,
    token: keyof InjectionTokensContractMap
  ): Observable<T> {
    return ssrAwaiter(this.deserializer.deserialize(data)).pipe(
      switchMap((deserializedData) =>
        this.transformer.transform<T, D>(deserializedData, token)
      )
    );
  }
}
