import { resolve } from '@spryker-oryx/di';
import { AddressComponentProperties, AddressService } from '@spryker-oryx/user';
import {
  MockAddressService,
  MockAddressType,
  mockCurrentAddress,
  uncompletedAddress,
} from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { AddressOptions } from '../address.model';

interface Props extends AddressComponentProperties, AddressOptions {}

const addressesIds = [mockCurrentAddress, uncompletedAddress].map(
  ({ id }) => id
);

export default {
  title: `${storybookPrefix}/Address`,
  args: {
    multiline: false,
    addressId: 'currentaddressid',
  },
  argTypes: {
    addressId: {
      options: addressesIds,
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<Props> = (props): TemplateResult => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  addressService.changeMockAddressType(MockAddressType.WithUncompleted);
  return html`<oryx-user-address
    .addressId=${props.addressId}
    .options=${props}
  ></oryx-user-address>`;
};

export const Demo = Template.bind({});
