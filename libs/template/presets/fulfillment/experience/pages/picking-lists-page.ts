import { ExperienceComponent } from '@spryker-oryx/experience';

export const pickingListsPage: ExperienceComponent = {
  id: 'picking-lists',
  type: 'Page',
  meta: {
    title: 'Picking Lists Page',
    route: '/',
    description: 'Picking Lists Page Description',
  },
  options: {
    rules: [{ layout: 'list' }],
  },
  components: [
    { ref: 'header-picking-lists' },
    {
      type: 'oryx-picking-lists',
      options: {
        rules: [
          {
            style: 'min-height: calc(100vh - 66px); box-sizing: border-box;',
          },
        ],
      },
    },
    { ref: 'service' },
  ],
};
