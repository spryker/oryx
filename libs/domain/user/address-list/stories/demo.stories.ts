import {
  AddressDefaults,
  UserAddressListItemOptions,
} from '@spryker-oryx/user/address-list-item';
import { MockAddressType } from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { renderSelector } from './helper';

export default {
  title: `${storybookPrefix}/Address List`,
  args: {
    selectable: true,
    addressDefaults: AddressDefaults.All,
  },
  argTypes: {
    addressDefaults: {
      control: { type: 'select' },
      options: Object.values(AddressDefaults),
    },
  },
} as unknown as Meta;

const Template: Story<UserAddressListItemOptions> = (props): TemplateResult => {
  return html`${renderSelector(MockAddressType.Three, props)}`;
};

export const Demo = Template.bind({});
