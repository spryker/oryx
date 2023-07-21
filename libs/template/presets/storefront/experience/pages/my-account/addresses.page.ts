import { StaticComponent } from '@spryker-oryx/experience';
import { EditTarget } from '@spryker-oryx/user/address-list-item';

export const addressBookPage: StaticComponent = {
  id: 'address-book',
  type: 'Page',
  meta: {
    title: 'Address book',
    route: '/my-account/addresses',
  },
  options: {
    rules: [
      { layout: 'flex', padding: '30px 0', width: '50%', margin: 'auto' },
    ],
  },
  components: [
    {
      type: 'oryx-user-address-list',
      options: {
        editable: true,
        removable: true,
        editTarget: EditTarget.Link,
      },
    },
    {
      type: 'oryx-user-address-add-button',
      options: { target: 'link' },
    },
  ],
};
