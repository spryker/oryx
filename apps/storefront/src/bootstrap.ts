import {
  ExperiencePreviewService,
  Services,
  STATIC_PROVIDERS,
} from '@spryker-oryx/experience';
import { ClassProvider, createInjector } from '@spryker-oryx/injector';
import { componentsMapping } from './components';
import { ComponentsRegistryService } from './components-registry.service';
import { RouterService } from './router.service';

const previewModeProviders = (): Array<ClassProvider> => {
  if (
    new URLSearchParams(new URL(window.location.href).search).get('ebPreview')
  ) {
    return [
      {
        provide: Services.Experience,
        useClass: ExperiencePreviewService,
      },
    ];
  }
  return [];
};

previewModeProviders();

createInjector({
  providers: [
    ...STATIC_PROVIDERS,
    ...previewModeProviders(),
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
    {
      provide: Services.Router,
      useClass: RouterService,
    },
  ],
});
