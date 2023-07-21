import { StaticComponent } from '@spryker-oryx/experience';

export const editAddressPage: StaticComponent = {
  id: 'edit-address',
  type: 'Page',
  meta: {
    title: 'Edit address page',
    route: '/my-account/addresses/edit/:id',
  },
  options: {
    rules: [{ layout: 'flex', width: '50%', margin: 'auto' }],
  },
  components: [{ type: 'oryx-user-address-edit' }],
};
