import { ExperienceComponent } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { Size } from '@spryker-oryx/utilities';

export const cartsPage: ExperienceComponent = {
  id: 'carts-page',
  type: 'Page',
  meta: {
    title: 'Carts',
    route: '/my-account/carts',
    description: 'Carts Page',
    routeType: RouteType.Carts,
  },
  options: { rules: [{ layout: 'list', padding: '30px 0' }] },
  components: [
    {
      type: 'oryx-site-breadcrumb',
      options: { rules: [{ query: { breakpoint: Size.Sm }, hide: true }] },
    },
    { ref: 'carts-page-content' },
  ],
};