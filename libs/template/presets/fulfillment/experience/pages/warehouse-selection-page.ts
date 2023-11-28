import { ExperienceComponent } from '@spryker-oryx/experience';

export const warehouseSelectionPage: ExperienceComponent = {
  id: 'warehouse-selection',
  type: 'Page',
  meta: {
    title: 'Warehouse Selection',
    route: '/warehouse-selection',
    description: 'Warehouse Selection Page Description',
  },
  options: {
    rules: [{ layout: 'list' }],
  },
  components: [
    { ref: 'header' },
    {
      type: 'oryx-picking-warehouse-assignment',
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
