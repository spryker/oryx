import { Provider } from '@spryker-oryx/injector';
import {
  BreakpointService,
  DefaultBreakpointService,
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

export const experienceProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
  },
  {
    provide: BreakpointService,
    useClass: DefaultBreakpointService,
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

export const experiencePreviewProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: PreviewExperienceService,
  },
];
