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

export const STATIC_PROVIDERS: Provider[] = [
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
];

export const STATIC_PREVIEW_PROVIDERS: Provider[] = [
  {
    provide: ExperienceService,
    useClass: PreviewExperienceService,
  },
];
