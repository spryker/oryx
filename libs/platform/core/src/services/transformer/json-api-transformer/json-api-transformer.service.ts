import { JsonApiPayload } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';
import { SerializerType, TransformerService } from '../transformer.service';

export const JsonAPITransformerService = 'FES.DefaultJsonAPITransformerService';

export interface JsonAPITransformerService extends TransformerService {
  serialize<T extends keyof InjectionTokensContractMap>(
    data: SerializerType<T>,
    token: T
  ): Observable<JsonApiPayload<unknown>>;
}

declare global {
  interface InjectionTokensContractMap {
    [JsonAPITransformerService]: JsonAPITransformerService;
  }
}
