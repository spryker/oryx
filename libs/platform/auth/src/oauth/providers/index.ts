import { Provider } from '@spryker-oryx/di';
import { provideOauthProvider } from '../provider-factory.service';

export * from './code-grant';
export * from './code-grant-login.strategy';
export * from './password-grant';
export * from './password-grant-login.strategy';

export const defaultOauthProviders: Provider[] = [
  ...provideOauthProvider('authorization_code', () =>
    import('./code-grant').then(
      (m) => (config) => new m.OauthCodeGrantProvider(config)
    )
  ),
  ...provideOauthProvider('password', () =>
    import('./password-grant').then(
      (m) => (config) => new m.OauthPasswordGrantProvider(config)
    )
  ),
];
