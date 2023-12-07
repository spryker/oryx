import { ExperienceComponent } from '@spryker-oryx/experience';

export const ServiceTemplate: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'service',
  components: [{ type: 'oryx-site-notification-center' }],
};
