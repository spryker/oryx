import { ExperienceComponent } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const warehouseSelectionPage: ExperienceComponent = {
  id: 'warehouse-selection',
  type: 'Page',
  meta: {
    title: 'Warehouse Selection',
    route: '/warehouse-selection',
    description: 'Warehouse Selection Page Description',
  },
  options: {
    rules: [
      { layout: 'flex', justify: 'center' },
      {
        query: { breakpoint: Size.Sm },
        width: '100%',
      },
      {
        query: { breakpoint: Size.Md },
        width: '414px',
      },
    ],
  },
  components: [
    {
      type: 'oryx-picking-warehouse-assignment',
      options: {
        rules: [
          {
            width: '100%',
          },
        ],
      },
    },
  ],
};
