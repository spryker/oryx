import { MockAddressType } from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { renderSelector } from './helper';

export default {
  title: `${storybookPrefix}/Address List`,
} as unknown as Meta;

const Template: Story = (props): TemplateResult => {
  return html`${renderSelector(MockAddressType.Three, props)}`;
};

export const Demo = Template.bind({});

Demo.args = {
  defaultType: 'shipping',
  selectable: false,
  editable: true,
};

Demo.argTypes = {
  defaultType: {
    control: { type: 'select' },
    options: ['shipping', 'billing'],
  },
  selectable: {
    control: { type: 'boolean' },
  },
  editable: {
    control: { type: 'boolean' },
  },
};
