import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ExperienceCompositionComponent } from './experience-composition.component';

export const experienceCompositionSchema: ContentComponentSchema<ExperienceCompositionComponent> =
  {
    name: 'Composition',
    group: 'Experience',
    icon: IconTypes.Composition,
  };
