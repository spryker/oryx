import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Billing address`,
  args: {
    addresses: MockAddressType.Two,
  },
  argTypes: {
    addresses: {
      options: Object.values(MockAddressType),
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

interface Props {
  addresses: MockAddressType;
}

const Template: Story<Props> = (props): TemplateResult => {
  const service = resolve<MockAddressService>(AddressService);
  service.changeMockAddressType(props.addresses);
  return html`<oryx-checkout-billing-address></oryx-checkout-billing-address> `;
};

export const Demo = Template.bind({});
