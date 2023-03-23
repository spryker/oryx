import { Provider } from '@spryker-oryx/di';
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
import { DefaultQueryService, QueryService } from './query';
import { DefaultStorageService, StorageService } from './storage';
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
];
