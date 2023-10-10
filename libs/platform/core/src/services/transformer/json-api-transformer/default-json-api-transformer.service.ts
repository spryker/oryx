// organize-imports-ignore
import { inject } from '@spryker-oryx/di';
import './json-api.shim';
// Add full import because of issue with naming exports from cjs.
import { JsonApiPayload } from '@spryker-oryx/utilities';
import jsonapi from 'jsonapi-serializer';
import { Observable, from, map, switchMap } from 'rxjs';
import {
  InheritTransformerResult,
  SerializerType,
  TransformerService,
} from '../transformer.service';
import { JsonAPITransformerService } from './json-api-transformer.service';

/**
 * Deserializes json response. Combines relationships, includes into one data (transforms include key e.g. 'include-example' into camelCase e.g 'includeExample').
 */
export class DefaultJsonAPITransformerService
  implements JsonAPITransformerService
{
  protected deserializer = new jsonapi.Deserializer({
    keyForAttribute: 'camelCase',
  });

  constructor(protected transformer = inject(TransformerService)) {}

  transform<T extends keyof InjectionTokensContractMap>(
    data: unknown,
    token: T
  ): InheritTransformerResult<T>;
  transform<T>(
    data: unknown,
    token: keyof InjectionTokensContractMap
  ): InheritTransformerResult<T> {
    return from(this.deserializer.deserialize(data)).pipe(
      switchMap((deserializedData) =>
        this.transformer.transform<T>(deserializedData, token)
      )
    );
  }

  do<T extends keyof InjectionTokensContractMap>(
    token: T
  ): (source$: Observable<unknown>) => InheritTransformerResult<T> {
    return (source$) =>
      source$.pipe(switchMap((data) => this.transform<T>(data, token)));
  }

  serialize<T extends keyof InjectionTokensContractMap>(
    data: SerializerType<T>,
    token: T
  ): Observable<JsonApiPayload<unknown>> {
    return this.transformer.transform<T>(data, token).pipe(
      map((serialized) => ({
        data: {
          ...(serialized as Record<string, unknown>),
        },
      }))
    ) as Observable<JsonApiPayload<unknown>>;
  }
}
