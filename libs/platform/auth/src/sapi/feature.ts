import {
  AnonAuthTokenService,
  AnonTokenInterceptor,
  AnonTokenInterceptorConfig,
  authLoginComponent,
  AuthTokenService,
  IdentityService,
  loginLinkComponent,
  OauthFeature,
  OauthFeatureConfig,
  OauthService,
  PasswordGrantAuthLoginStrategy,
  PasswordGrantAuthLoginStrategyConfig,
} from '@spryker-oryx/auth';
import { AuthLoginStrategy } from '@spryker-oryx/auth/login';
import { AppFeature, HttpInterceptor } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { ComponentsInfo, featureVersion } from '@spryker-oryx/utilities';
import {
  GuestIdentityInterceptor,
  GuestIdentityInterceptorConfig,
} from './guest-identity.interceptor';
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
        useFactory:
          featureVersion >= '1.4'
            ? () => inject(OauthService)
            : () =>
                new AnonAuthTokenService(
                  inject(OauthService),
                  inject(OauthService)
                ),
      },
      { provide: IdentityService, useClass: SapiIdentityService },
      {
        provide: HttpInterceptor,
        useClass:
          featureVersion >= '1.4'
            ? GuestIdentityInterceptor
            : AnonTokenInterceptor,
      },
      featureVersion >= '1.4'
        ? {
            provide: GuestIdentityInterceptorConfig,
            useFactory: () =>
              ({
                baseUrl: inject('SCOS_BASE_URL'),
                headerName: 'X-Anonymous-Customer-Unique-Id',
                ...configFactory().guestIdentityInterceptor,
              } as GuestIdentityInterceptorConfig),
          }
        : {
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
  /** deprecated since 1.4 */
  anonTokenInterceptor?: AnonTokenInterceptorConfig;
  guestIdentityInterceptor?: GuestIdentityInterceptorConfig;
}

export class SapiAuthComponentsFeature implements AppFeature {
  components: ComponentsInfo = [authLoginComponent, loginLinkComponent];
}
