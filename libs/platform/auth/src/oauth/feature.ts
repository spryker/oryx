import { AppFeature, HttpInterceptor } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import {
  AuthService,
  AuthTokenInterceptor,
  AuthTokenInterceptorConfig,
  AuthTokenService,
} from '../services';
import { OauthService, OauthServiceConfig } from './oauth.service';
import {
  DefaultOauthProviderFactoryService,
  OauthProviderFactoryService,
} from './provider-factory.service';
import { defaultOauthProviders } from './providers';

export class OauthFeature implements AppFeature {
  providers;

  constructor(config: OauthFeatureConfig | (() => OauthFeatureConfig)) {
    const configFactory = typeof config === 'function' ? config : () => config;
    this.providers = this.getProviders(configFactory);
  }

  protected getProviders(configFactory: () => OauthFeatureConfig): Provider[] {
    return [
      { provide: OauthService, useClass: OauthService },
      { provide: OauthServiceConfig, useFactory: () => configFactory() },
      { provide: AuthService, useFactory: () => inject(OauthService) },
      { provide: AuthTokenService, useFactory: () => inject(OauthService) },
      { provide: HttpInterceptor, useClass: AuthTokenInterceptor },
      {
        provide: AuthTokenInterceptorConfig,
        useFactory: () => configFactory().tokenInterceptor,
      },
      {
        provide: OauthProviderFactoryService,
        useClass: DefaultOauthProviderFactoryService,
      },
      ...defaultOauthProviders,
    ];
  }
}

export interface OauthFeatureConfig extends OauthServiceConfig {
  tokenInterceptor?: AuthTokenInterceptorConfig;
}
