import {
  CompositionLayout,
  ExperienceComponent,
} from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const customerNotePage: ExperienceComponent = {
  id: 'warehouse-selection',
  type: 'Page',
  meta: {
    title: 'Warehouse Selection',
    route: '/customer-note-info/:id',
    description: 'Warehouse Selection Page Description',
  },
  options: {
    rules: [
      { layout: CompositionLayout.Flex, justify: 'center' },
      {
        query: { breakpoint: Size.Sm },
        width: '100%',
      },
      {
        query: { breakpoint: Size.Md },
        width: '530px',
      },
    ],
  },
  components: [
    {
      type: 'oryx-picking-customer-note',
    },
  ],
};
