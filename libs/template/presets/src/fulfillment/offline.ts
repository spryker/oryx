import { AppFeature, HttpInterceptor, coreFeature, injectEnv } from '@spryker-oryx/core';
import { I18nFeature, I18nFeatureOptions } from '@spryker-oryx/i18n';
import {
  IndexedDbFeature,
  IndexedDbFeatureConfig,
} from '@spryker-oryx/indexed-db';
import {
  OfflineFeature,
  OfflineServiceWorkerFeature,
} from '@spryker-oryx/offline';
import {
  OfflinePickingFeature,
  SwOfflinePickingFeature,
} from '@spryker-oryx/picking/offline';
import { fulfillmentFeatures, FulfillmentFeaturesConfig } from './app';
import { BapiAuthFeature } from '@spryker-oryx/application';
import { AuthService, AuthTokenInterceptorConfig, AuthTokenService, DefaultOauthProviderFactoryService, OauthFeature, OauthProviderFactoryService, OauthService, OauthServiceConfig, OauthTokenInterceptor } from '@spryker-oryx/auth';
import urlJoin from 'url-join';
import { RouterFeature } from '@spryker-oryx/router';
import { WebPushNotificationFeature } from '@spryker-oryx/push-notification/web';
import { inject } from '@spryker-oryx/di';

export interface SharedOfflineFulfillmentFeaturesConfig {
  indexedDb?: IndexedDbFeatureConfig;
}

export interface OfflineFulfillmentFeaturesConfig
  extends FulfillmentFeaturesConfig,
    SharedOfflineFulfillmentFeaturesConfig {}

export const defaultOfflineFulfillmentConfig: SharedOfflineFulfillmentFeaturesConfig =
  {
    indexedDb: { dbName: 'fulfillment-app-db' },
  };

export function offlineFulfillmentFeatures(
  config?: OfflineFulfillmentFeaturesConfig
): AppFeature[] {
  config = {
    ...defaultOfflineFulfillmentConfig,
    ...config,
  };

  return [
    ...fulfillmentFeatures(config),
    new IndexedDbFeature(config?.indexedDb),
    new OfflineFeature(),
    new OfflinePickingFeature(),
  ];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OfflineServiceWorkerFulfillmentFeaturesConfig
  extends SharedOfflineFulfillmentFeaturesConfig {
  i18n?: I18nFeatureOptions;
}

export function offlineServiceWorkerFulfillmentFeatures(
  config?: OfflineServiceWorkerFulfillmentFeaturesConfig
): AppFeature[] {
  config = {
    ...defaultOfflineFulfillmentConfig,
    ...config,
  };

  return [
    coreFeature,
    new I18nFeature(config?.i18n),
    new IndexedDbFeature(config?.indexedDb),
    new OfflineServiceWorkerFeature(),
    new OfflinePickingFeature(),
    new SwOfflinePickingFeature(),
    // new RouterFeature(),
    // {
    //   providers: [
    //     { provide: OauthService, useClass: OauthService },
    //     { provide: OauthServiceConfig, useFactory: () => ({
    //         loginRoute: '/login',
    //         providers: [
    //           {
    //             id: 'spryker',
    //             clientId: 'frontend',
    //             grantType: 'authorization_code',
    //             authUrl: new URL('/login', globalThis.location.origin).toString(),
    //             tokenUrl: urlJoin(
    //               injectEnv('ORYX_FULFILLMENT_BACKEND_URL') ?? '',
    //               '/token'
    //             ),
    //             redirectUrl: new URL(
    //               '/oauth/cb/spryker',
    //               globalThis.location.origin
    //             ).toString(),
    //           },
    //         ],
    //         defaultProvider: 'spryker',
    //       }) },
    //     { provide: AuthService, useFactory: () => inject(OauthService) },
    //     { provide: AuthTokenService, useFactory: () => inject(OauthService) },
    //     { provide: HttpInterceptor, useClass: OauthTokenInterceptor },
    //     {
    //       provide: OauthProviderFactoryService,
    //       useClass: DefaultOauthProviderFactoryService,
    //     },
    //   //   {
    //   //     provide: AuthTokenInterceptorConfig,
    //   //     useFactory: () => configFactory().tokenInterceptor,
    //   // },
    //   ],
    // },

    // new WebPushNotificationFeature(),
    // new RouterFeature(),
    // new OauthFeature(() => ({
    //   loginRoute: '/login',
    //   providers: [
    //     {
    //       id: 'spryker',
    //       clientId: 'frontend',
    //       grantType: 'authorization_code',
    //       authUrl: new URL('/login', globalThis.location.origin).toString(),
    //       tokenUrl: urlJoin(
    //         injectEnv('ORYX_FULFILLMENT_BACKEND_URL') ?? '',
    //         '/token'
    //       ),
    //       redirectUrl: new URL(
    //         '/oauth/cb/spryker',
    //         globalThis.location.origin
    //       ).toString(),
    //     },
    //   ],
    //   defaultProvider: 'spryker',
    // }))
    // new BapiAuthFeature(),
  ];
}
