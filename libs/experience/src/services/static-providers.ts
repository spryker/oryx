import { Provider } from '@spryker-oryx/injector';
import {
  DefaultExperienceService,
  DefaultLayoutBuilder,
  ExperienceService,
  LayoutBuilder,
  PreviewExperienceService,
} from './experience';
import {
  ComponentsRegistryService,
  DefaultComponentsRegistryService,
} from './registry';

export const staticProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
  },
  {
    provide: LayoutBuilder,
    useClass: DefaultLayoutBuilder,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
];

export const staticPreviewProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: PreviewExperienceService,
  },
];
