import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import {
  MockAddressService,
  MockAddressType,
  mockCurrentAddress,
  uncompletedAddress,
} from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { AddressOptions } from '../address.model';

export default {
  title: `${storybookPrefix}/Address`,
  args: {
    multiline: false,
    addressId: 'currentaddressid',
  },
  argTypes: {
    addressId: {
      options: [mockCurrentAddress, uncompletedAddress].map(({ id }) => id),
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<AddressOptions & { addressId?: string }> = (
  props
): TemplateResult => {
  resolve<MockAddressService>(AddressService).changeMockAddressType(
    MockAddressType.Incomplete
  );
  return html`<oryx-user-address
    .addressId=${props.addressId}
    .options=${props}
  ></oryx-user-address>`;
};

export const Demo = Template.bind({});
