import { Provider } from '@spryker-oryx/di';

export const mockCoreProviders: Provider[] = [
  {
    provide: 'SCOS_BASE_URL',
    useValue: '',
  },
];
