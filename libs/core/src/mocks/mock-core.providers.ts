import {
  DefaultHttpService,
  DefaultStorageService,
  HttpService,
  StorageService,
} from '../services';

export const mockCoreProviders = [
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
  {
    provide: StorageService,
    useClass: DefaultStorageService,
  },
  {
    provide: 'SCOS_BASE_URL',
    useValue: '',
  },
];
