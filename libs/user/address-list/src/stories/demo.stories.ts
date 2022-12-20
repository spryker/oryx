import { MockAddressType } from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { AddressListOptions } from '../address-list.model';
import { renderSelector } from './helper';

export default {
  title: `${storybookPrefix}/Address List`,
  args: {
    selectable: true,
  },
} as unknown as Meta;

const Template: Story<AddressListOptions> = (props): TemplateResult => {
  return html`${renderSelector(MockAddressType.ThreeWithDefaults, props)}`;
};

export const Demo = Template.bind({});
