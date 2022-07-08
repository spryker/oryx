import { inject } from '@spryker-oryx/injector';
import { Deserializer } from 'jsonapi-serializer';
import { map, Observable } from 'rxjs';
import { ssrAwaiter } from '../../../utilities';
import { Transformer, TransformerService } from '../transformer.service';
import { JsonAPITransformerService } from './json-api-transformer.service';

/**
 * Deserializes json response. Combines relationships, includes into one data (transforms include key e.g. 'include-example' into camelCase e.g 'includeExample').
 */
export class DefaultJsonAPITransformerService
  implements JsonAPITransformerService
{
  protected deserializer = new Deserializer({
    keyForAttribute: 'camelCase',
  });

  constructor(protected transformer = inject(TransformerService)) {}

  transform<T, D>(
    data: D,
    token: keyof InjectionTokensContractMap
  ): Observable<T> {
    return ssrAwaiter(this.deserializer.deserialize(data)).pipe(
      map((deserializedData) =>
        this.transformer.getTransformers(token).reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (currentData: any, cb: Transformer<any>) => ({
            ...currentData,
            ...cb(deserializedData, this.transformer),
          }),
          null
        )
      )
    );
  }
}
