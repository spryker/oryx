import {
  DefaultJsonAPITransformerService,
  InheritTransformerResult,
} from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { switchMap } from 'rxjs';

export class ServerJsonApiTransformerService extends DefaultJsonAPITransformerService {
  constructor() {
    super();
  }

  transform<T>(
    data: unknown,
    token: keyof InjectionTokensContractMap
  ): InheritTransformerResult<T> {
    return ssrAwaiter(this.deserializer.deserialize(data)).pipe(
      switchMap((deserializedData) =>
        this.transformer.transform<T>(deserializedData, token)
      )
    );
  }
}
