import { Provider } from '@spryker-oryx/injector';

export const mockCoreProviders: Provider[] = [
  {
    provide: 'SCOS_BASE_URL',
    useValue: '',
  },
];
