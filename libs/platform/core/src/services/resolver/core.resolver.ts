import { Provider } from '@spryker-oryx/di';
import { isServer } from 'lit';
import { of } from 'rxjs';
import {
  BaseResolver,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '../token-resolver';

export type CoreResolvers = {
  SERVER: Resolver;
};

export class CoreResolver extends BaseResolver<CoreResolvers> {
  protected resolvers = {
    SERVER: (): ResolvedToken => {
      return of(isServer);
    },
  };
}

export const CoreResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}CORE`,
  useClass: CoreResolver,
};
