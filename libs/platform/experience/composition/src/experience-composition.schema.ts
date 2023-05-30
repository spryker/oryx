import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ExperienceCompositionComponent } from './experience-composition.component';

export const experienceCompositionSchema: ContentComponentSchema<ExperienceCompositionComponent> =
  {
    name: 'Composition',
    group: 'Experience',
    icon: 'dashboard_customize',
  };
