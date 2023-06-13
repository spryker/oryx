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

export default {
  title: `${storybookPrefix}/Address`,
} as Meta;

const service = resolve<MockAddressService>(AddressService);
service.changeMockAddressType(MockAddressType.ThreeWithDefaults);

const Template: Story = (): TemplateResult => {
  return html`
    <h3>(multiline)</h3>
    <oryx-checkout-address
      .options=${{ enableList: false }}
      .addressId=${mockNormalizedAddresses[0].id}
    ></oryx-checkout-address>

    <h3>(multiline - no addressId)</h3>
    <oryx-checkout-address
      .options=${{ enableList: false }}
    ></oryx-checkout-address>

    <h3>(list)</h3>
    <oryx-checkout-address
      .options=${{ enableList: true }}
      .addressId=${mockNormalizedAddresses[0].id}
    ></oryx-checkout-address>

    <h3>(list - no addressId)</h3>
    <oryx-checkout-address
      .options=${{ enableList: true }}
    ></oryx-checkout-address>
  `;
};

export const Static = Template.bind({});
