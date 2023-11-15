import { ExperienceComponent } from '@spryker-oryx/experience';

export const customerNotePage: ExperienceComponent = {
  id: 'customer-note',
  type: 'Page',
  meta: {
    title: 'Customer Note',
    route: '/customer-note-info/:pickingListId',
    description: 'Customer Note Page Description',
  },
  options: {
    rules: [{ layout: 'list' }],
  },
  components: [
    {
      type: 'oryx-picking-customer-note',
    },
    { ref: 'service' }
  ],
};
