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
    rules: [
      {
        layout: 'list',
        style: 'min-height: calc(100vh - 66px); box-sizing: border-box;',
      },
    ],
  },
  components: [
    { ref: 'header-picker' },
    {
      type: 'oryx-picking-picker',
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
