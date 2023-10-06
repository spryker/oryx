import {
  authLoginComponent,
  CodeGrantAuthLoginStrategy,
  CodeGrantAuthLoginStrategyConfig,
  IdentityService,
  loginLinkComponent,
  OauthFeature,
  OauthFeatureConfig,
  oauthHandlerComponent,
} from '@spryker-oryx/auth';
import { AuthLoginStrategy } from '@spryker-oryx/auth/login';
import { AppFeature, AppPlugin, injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { ComponentsInfo } from '@spryker-oryx/utilities';
import urlJoin from 'url-join';
import { BapiIdentityService } from './bapi-identity.service';
import { BapiPlugin } from './plugin';
import { defaultBapiRoutes } from './routes';

/**
 * Backoffice API Authentication feature
 *
 * By default it sets up a login route at `/login`
 * with a Spryker `authorization_code` grant Oauth flow
 * where login page is hosted by the app itself
 * and a callback route at `/oauth/cb/spryker`
 * which handles the Oauth redirect response.
 */
export class BapiAuthFeature extends OauthFeature implements AppFeature {
  protected static defaultConfigFactory(): BapiAuthFeatureConfig {
    return {
      loginRoute: '/login',
      providers: [
        {
          id: 'spryker',
          clientId: injectEnv('ORYX_FULFILLMENT_CLIENT_ID') ?? '',
          grantType: 'authorization_code',
          authUrl: new URL('/login', globalThis.location.origin).toString(),
          tokenUrl: urlJoin(
            injectEnv('ORYX_FULFILLMENT_BACKEND_URL') ?? '',
            '/token'
          ),
          redirectUrl: new URL(
            '/oauth/cb/spryker',
            globalThis.location.origin
          ).toString(),
        },
      ],
      defaultProvider: 'spryker',
    };
  }

  plugins: AppPlugin[] = [new BapiPlugin()];

  constructor(
    config:
      | BapiAuthFeatureConfig
      | (() => BapiAuthFeatureConfig) = BapiAuthFeature.defaultConfigFactory
  ) {
    super(config);
  }

  protected override getProviders(
    configFactory: () => BapiAuthFeatureConfig
  ): Provider[] {
    return [
      ...super.getProviders(configFactory),
      ...provideLitRoutes(() => ({
        routes: configFactory().skipRoutes
          ? []
          : defaultBapiRoutes(
              configFactory().loginRoute,
              '/oauth/cb/spryker',
              configFactory().providers[0].id
            ),
      })),
      { provide: IdentityService, useClass: BapiIdentityService },
      { provide: AuthLoginStrategy, useClass: CodeGrantAuthLoginStrategy },
      {
        provide: CodeGrantAuthLoginStrategyConfig,
        useFactory: () =>
          ({
            loginUrl: urlJoin(
              injectEnv('ORYX_FULFILLMENT_BACKEND_URL') ?? '',
              '/authorize'
            ),
          } as CodeGrantAuthLoginStrategyConfig),
      },
    ];
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BapiAuthFeatureConfig extends OauthFeatureConfig {
  skipRoutes?: boolean;
}

export class BapiAuthComponentsFeature implements AppFeature {
  components: ComponentsInfo = [
    authLoginComponent,
    loginLinkComponent,
    oauthHandlerComponent,
  ];
}
