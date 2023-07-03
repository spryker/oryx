import {
  AnonAuthTokenService,
  AnonTokenInterceptor,
  AnonTokenInterceptorConfig,
  AuthTokenInterceptorConfig,
  AuthTokenService,
  IdentityService,
  OauthFeature,
  OauthFeatureConfig,
  OauthService,
  PasswordGrantAuthLoginStrategy,
  PasswordGrantAuthLoginStrategyConfig,
} from '@spryker-oryx/auth';
import { AuthLoginStrategy } from '@spryker-oryx/auth/login';
import {
  AppFeature,
  ComponentsInfo,
  HttpInterceptor,
} from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { loginLinkComponent } from '@spryker-oryx/auth/login-link';
import { authLoginComponent } from '@spryker-oryx/auth/login';
import { SapiIdentityService } from './sapi-identity.service';

/**
 * Storefront API Authentication feature
 *
 * By default it sets up a login route at `/login`
 * with a Spryker `password` grant Oauth flow.
 */
export class SapiAuthFeature extends OauthFeature implements AppFeature {
  protected static defaultConfigFactory(): SapiAuthFeatureConfig {
    return {
      loginRoute: '/login',
      providers: [
        {
          id: 'spryker',
          clientId: '',
          grantType: 'password',
          tokenUrl: new URL('/token', inject('SCOS_BASE_URL')).toString(),
        },
      ],
    };
  }

  constructor(
    config:
      | SapiAuthFeatureConfig
      | (() => SapiAuthFeatureConfig) = SapiAuthFeature.defaultConfigFactory
  ) {
    super(config);
  }

  protected override getProviders(
    configFactory: () => SapiAuthFeatureConfig
  ): Provider[] {
    return [
      ...super.getProviders(configFactory),
      {
        provide: AuthTokenService,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        useFactory: () =>
          new AnonAuthTokenService(inject(OauthService), inject(OauthService)),
      },
      { provide: IdentityService, useClass: SapiIdentityService },
      { provide: HttpInterceptor, useClass: AnonTokenInterceptor },
      {
        provide: AuthTokenInterceptorConfig,
        useFactory: () =>
          ({
            baseUrl: inject('SCOS_BASE_URL'),
            ...configFactory().tokenInterceptor,
          } as AuthTokenInterceptorConfig),
      },
      {
        provide: AnonTokenInterceptorConfig,
        useFactory: () =>
          ({
            baseUrl: inject('SCOS_BASE_URL'),
            headerName: 'X-Anonymous-Customer-Unique-Id',
            ...configFactory().anonTokenInterceptor,
          } as AnonTokenInterceptorConfig),
      },
      { provide: AuthLoginStrategy, useClass: PasswordGrantAuthLoginStrategy },
      {
        provide: PasswordGrantAuthLoginStrategyConfig,
        useFactory: () =>
          ({
            defaultProviderId: configFactory().providers[0].id,
          } as PasswordGrantAuthLoginStrategyConfig),
      },
    ];
  }
}

export interface SapiAuthFeatureConfig extends OauthFeatureConfig {
  skipRoutes?: boolean;
  anonTokenInterceptor?: AnonTokenInterceptorConfig;
}

export class SapiAuthComponentsFeature implements AppFeature {
  components: ComponentsInfo = [authLoginComponent, loginLinkComponent];
}
