import { ExperienceComponent } from '@spryker-oryx/experience';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page',
  type: 'Page',
  meta: {
    title: 'Merchant Page',
    route: '/merchant/:merchant',
    description: 'Default Merchant Page Description',
  },
  components: [
    {
      type: 'oryx-product-sold-by',
    },
  ],
};
