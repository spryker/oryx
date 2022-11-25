import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { BehaviorType, toggleBehavior } from '../utils';

export default {
  title: `${storybookPrefix}/Delivery/Static`,
} as unknown as Meta;

interface Props {
  behavior: BehaviorType;
}

const Template: Story<Props> = (props): TemplateResult => {
  toggleBehavior(props.behavior);
  return html` <checkout-delivery></checkout-delivery> `;
};

export const Guest = Template.bind({});
export const Authorized = Template.bind({});
export const WithAddress = Template.bind({});

Guest.args = {
  behavior: 'guest',
};
Authorized.args = {
  behavior: 'no-address',
};
WithAddress.args = {
  behavior: 'with-address',
};
