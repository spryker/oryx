import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { asyncOpen, BehaviorType, toggleBehavior } from '../utils';

export default {
  title: `${storybookPrefix}/Manage Address/Static`,
  decorators: [OverlaysDecorator()],
} as unknown as Meta;

interface Props {
  behavior: BehaviorType;
}

const Template: Story<Props> = (props): TemplateResult => {
  toggleBehavior(props.behavior);
  asyncOpen();

  return html`
    <style>
      oryx-checkout-manage-address {
        display: inline-flex;
      }
    </style>
    <oryx-checkout-manage-address></oryx-checkout-manage-address>
  `;
};

export const WithoutAddress = Template.bind({});
export const WithAddresses = Template.bind({});
export const LongList = Template.bind({});

WithoutAddress.args = {};
WithAddresses.args = {
  behavior: 'with-address',
};
LongList.args = {
  behavior: 'long-list',
};
