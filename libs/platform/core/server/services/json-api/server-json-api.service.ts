import {
  DefaultJsonAPITransformerService,
  InheritTransformerResult,
} from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';

export class ServerJsonApiTransformerService extends DefaultJsonAPITransformerService {
  transform<T extends keyof InjectionTokensContractMap>(
    data: unknown,
    token: T
  ): InheritTransformerResult<T>;
  transform<T>(
    data: unknown,
    token: keyof InjectionTokensContractMap
  ): InheritTransformerResult<T> {
    return ssrAwaiter<any>(super.transform(data, token));
  }
}
