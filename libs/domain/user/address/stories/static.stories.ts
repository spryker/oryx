import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Address/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  addressService.changeMockAddressType(MockAddressType.Incomplete);
  return html`
    <h4>Address</h4>
    <oryx-user-address addressId="currentaddressid"></oryx-user-address>

    <h4>Multiline</h4>
    <oryx-user-address
      addressId="currentaddressid"
      .options=${{ multiline: true }}
    ></oryx-user-address>

    <h4>With missed fields</h4>
    <oryx-user-address addressId="uncompleted"></oryx-user-address>

    <h4>With missed fields (multiline)</h4>
    <oryx-user-address
      addressId="uncompleted"
      .options=${{ multiline: true }}
    ></oryx-user-address>
  `;
};

export const Variants = Template.bind({});
