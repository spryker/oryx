import {
  ExperiencePreviewService,
  Services,
  STATIC_PROVIDERS,
} from '@spryker-oryx/experience';
import { ClassProvider, createInjector } from '@spryker-oryx/injector';
import { componentsMapping } from './components';
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
      useValue: __CONTENT_BACKEND_URL__ || 'http://localhost:3013',
    },
    {
      provide: Services.ComponentMapping,
      useValue: componentsMapping,
    },
    {
      provide: Services.Router,
      useClass: RouterService,
    },
  ],
});
