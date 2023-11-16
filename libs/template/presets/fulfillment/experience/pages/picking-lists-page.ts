import { ExperienceComponent } from '@spryker-oryx/experience';

export const pickingListsPage: ExperienceComponent = {
  id: 'picking-lists',
  type: 'Page',
  meta: {
    title: 'Warehouse Selection',
    route: '/',
    description: 'Picking Lists Page Description',
  },
  options: {
    rules: [{ layout: 'list' }],
  },
  components: [
    {
      type: 'oryx-picking-lists',
    },
    { ref: 'service' },
  ],
};
