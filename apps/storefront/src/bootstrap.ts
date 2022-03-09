import { STATIC_PROVIDERS } from '@spryker-oryx/experience';
import { createInjector } from '@spryker-oryx/injector';
import { componentsMapping } from './components';
import { ComponentsRegistryService } from './components-registry.service';

createInjector({
  providers: [
    ...STATIC_PROVIDERS,
    {
      provide: 'CONTENT_BACKEND_URL',
      useValue: 'http://localhost:3013',
    },
    {
      provide: 'FES.ComponentsRegistry',
      useClass: ComponentsRegistryService,
    },
    {
      provide: 'FES.ComponentMapping',
      useValue: componentsMapping,
    },
  ],
});
