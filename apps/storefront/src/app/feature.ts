import { AppFeature } from '@spryker-oryx/core';
import { COMPONENT_MAPPING } from '@spryker-oryx/experience';
import { componentsMapping } from './components';

export const appFeature: AppFeature = {
  providers: [
    {
      provide: 'CONTENT_BACKEND_URL',
      useValue: import.meta.env.FES_CONTENT_BACKEND_URL || '',
    },
    {
      provide: 'SCOS_BASE_URL',
      useValue: import.meta.env.SCOS_BASE_URL || '',
    },
    {
      provide: COMPONENT_MAPPING,
      useValue: componentsMapping,
    },
  ],
};
