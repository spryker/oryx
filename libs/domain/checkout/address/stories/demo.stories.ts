import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import {
  MockAddressService,
  MockAddressType,
  mockNormalizedAddresses,
} from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CheckoutAddressOptions } from '../address.model';

export default {
  title: `${storybookPrefix}/Address`,
  args: {
    enableList: false,
    addressId: mockNormalizedAddresses[0].id,
  },
  argTypes: {
    addressId: {
      options: mockNormalizedAddresses.map((a) => a.id),
      control: { type: 'select' },
      table: { category: 'Demo' },
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props extends CheckoutAddressOptions {
  addressId: MockAddressType;
}

const service = resolve<MockAddressService>(AddressService);
service.changeMockAddressType(MockAddressType.ThreeWithDefaults);

const Template: Story<Props> = (props): TemplateResult => {
  return html`<oryx-checkout-address
    .options=${props}
    .addressId=${props.addressId}
  ></oryx-checkout-address> `;
};

export const Demo = Template.bind({});
