import { Provider } from '@spryker-oryx/injector';
import {
  DefaultExperienceService,
  ExperienceService,
  PreviewExperienceService,
} from './experience';
import {
  ComponentsRegistryService,
  DefaultComponentsRegistryService,
} from './registry';

export const statictProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
];

export const statictPreviewProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: PreviewExperienceService,
  },
];
