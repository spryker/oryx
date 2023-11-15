import { ExperienceComponent } from '@spryker-oryx/experience';

export const pickingPickerPage: ExperienceComponent = {
  id: 'picking-picker',
  type: 'Page',
  meta: {
    title: 'Picking Picker',
    route: '/picking-list/picking/:pickingListId',
    description: 'Picking Picker Page Description',
  },
  options: {
    rules: [{ layout: 'list' }],
  },
  components: [
    {
      type: 'oryx-picking-picker',
    },
    { ref: 'service' }
  ],
};
