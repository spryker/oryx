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
    {
      type: 'oryx-picking-warehouse-assignment',
    },
    { ref: 'service' },
  ],
};
