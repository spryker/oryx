import { StaticComponent } from '@spryker-oryx/experience';
import { EditTarget } from '@spryker-oryx/user/address-list-item';

export const addressBookPage: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Address book',
    route: '/my-account/addresses',
  },
  options: {
    data: {
      rules: [
        { layout: 'flex', padding: '30px 0', width: '50%', margin: 'auto' },
      ],
    },
  },
  components: [
    {
      type: 'oryx-user-address-list',
      options: {
        data: {
          selectable: true,
          editable: true,
          removable: true,
          editTarget: EditTarget.Link,
        },
      },
    },
    {
      type: 'oryx-user-address-add-trigger',
      options: { data: { target: 'link' } },
    },
    {
      type: 'oryx-user-address-edit-trigger',
      options: { data: { target: 'link' } },
    },
  ],
};

export const addressBookPageModal: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Address Book (modal)',
    route: '/my-account/addresses-modal',
  },
  options: {
    data: {
      rules: [
        { layout: 'flex', padding: '30px 0', width: '50%', margin: 'auto' },
      ],
    },
  },
  components: [
    {
      type: 'oryx-user-address-list',
      options: {
        data: {
          selectable: true,
          editable: true,
          removable: true,
          editTarget: EditTarget.Modal,
        },
      },
    },
    {
      type: 'oryx-user-address-add-trigger',
      options: { data: { target: 'modal' } },
    },
    {
      type: 'oryx-user-address-edit-trigger',
      options: { data: { target: 'modal' } },
    },
  ],
};

export const addressBookPageInline: StaticComponent = {
  type: 'Page',
  meta: {
    title: 'Addresses (inline)',
    route: '/my-account/addresses-inline',
  },
  options: { data: { rules: [{ layout: 'split', padding: '30px 0' }] } },
  components: [
    {
      type: 'experience-composition',
      options: { data: { rules: [{ layout: 'flex' }] } },

      components: [
        {
          type: 'oryx-user-address-list',
          options: {
            data: {
              selectable: true,
              editable: true,
              removable: true,
              editTarget: EditTarget.Inline,
            },
          },
        },
        {
          type: 'oryx-user-address-edit-trigger',
          options: { data: { target: 'inline' } },
        },
        {
          type: 'oryx-user-address-add-trigger',
          options: { data: { target: 'inline' } },
        },
      ],
    },
    {
      type: 'oryx-user-address-edit',
      options: { data: { inline2: true } },
    },
  ],
};
