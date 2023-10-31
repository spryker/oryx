import {
  CompositionLayout,
  ExperienceComponent,
} from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const pickingListsPage: ExperienceComponent = {
  id: 'picking-lists',
  type: 'Page',
  meta: {
    title: 'Warehouse Selection',
    route: '/',
    description: 'Picking Lists Page Description',
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
      type: 'oryx-picking-lists',
    },
  ],
};
