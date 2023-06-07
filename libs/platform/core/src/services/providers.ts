import { Provider } from '@spryker-oryx/di';
import {
  AppInitializer,
  AppInitializerService,
  DefaultAppInitializerService,
} from './app-initializer';
import { ContextService, DefaultContextService } from './context';
import { DefaultErrorService, ErrorService } from './error';
import {
  DefaultFeatureOptionsService,
  FeatureOptionsService,
} from './feature-options';
import {
  DefaultHttpHandler,
  DefaultHttpService,
  HttpHandler,
  HttpService,
} from './http';
import { DefaultHydrationService, HydrationService } from './hydration';
import {
  DefaultPageMetaResolverService,
  DefaultPageMetaService,
  PageMetaResolverService,
  PageMetaService,
} from './page-meta';
import { DefaultQueryService, QueryService } from './query';
import {
  DefaultIndexedDBStorageService,
  DefaultStorageService,
  IndexedDBStorageService,
  StorageService,
} from './storage';
import { DefaultTokenService, TokenResolver } from './token-resolver';
import {
  DefaultJsonAPITransformerService,
  DefaultTransformerService,
  JsonAPITransformerService,
  TransformerService,
} from './transformer';

export const coreProviders: Provider[] = [
  {
    provide: HttpHandler,
    useClass: DefaultHttpHandler,
  },
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
  {
    provide: ContextService,
    useClass: DefaultContextService,
  },
  {
    provide: JsonAPITransformerService,
    useClass: DefaultJsonAPITransformerService,
  },
  {
    provide: TransformerService,
    useClass: DefaultTransformerService,
  },
  {
    provide: IndexedDBStorageService,
    useClass: DefaultIndexedDBStorageService,
  },
  {
    provide: StorageService,
    useClass: DefaultStorageService,
  },
  {
    provide: ErrorService,
    useClass: DefaultErrorService,
  },
  {
    provide: FeatureOptionsService,
    useClass: DefaultFeatureOptionsService,
  },
  {
    provide: QueryService,
    useClass: DefaultQueryService,
  },
  {
    provide: HydrationService,
    useClass: DefaultHydrationService,
  },
  {
    provide: AppInitializerService,
    useClass: DefaultAppInitializerService,
  },
  {
    provide: AppInitializer,
    useExisting: ErrorService,
  },
  {
    provide: TokenResolver,
    useClass: DefaultTokenService,
  },
  {
    provide: PageMetaService,
    useClass: DefaultPageMetaService,
  },
  {
    provide: PageMetaResolverService,
    useClass: DefaultPageMetaResolverService,
  },
  {
    provide: AppInitializer,
    useExisting: PageMetaResolverService,
  },
];
