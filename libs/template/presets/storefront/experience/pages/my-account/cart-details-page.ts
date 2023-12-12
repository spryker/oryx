import { ExperienceComponent } from '@spryker-oryx/experience';
import { cartPage } from '../cart-page';

export const cartDetailsPage: ExperienceComponent = {
  ...cartPage,
  id: 'cart-details-page',
  meta: {
    title: 'Cart Details Page',
    route: '/my-account/carts/:cartId',
    description: 'Cart Details Page Description',
  },
};
