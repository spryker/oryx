import { OverlaysDecorator } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { asyncOpen, BehaviorType, toggleBehavior } from '../utils';

export default {
  title: `${storybookPrefix}/Address Modal/Static`,
  decorators: [OverlaysDecorator()],
} as unknown as Meta;

interface Props {
  behavior: BehaviorType;
}

const Template: Story<Props> = (props): TemplateResult => {
  toggleBehavior(props.behavior);
  asyncOpen();

  return html` <oryx-user-address-modal></oryx-user-address-modal> `;
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
