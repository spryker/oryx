import { ExperienceComponent } from '@spryker-oryx/experience';
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
      {
        layout: 'flex',
        justify: 'center',
      },
      {
        query: { breakpoint: Size.Sm },
        width: '100%',
      },
    ],
  },
  components: [
    {
      type: 'oryx-picking-lists',
    },
  ],
};
