import { BehaviorType, toggleBehavior } from '@spryker-oryx/checkout/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Delivery/Static`,
} as unknown as Meta;

interface Props {
  behavior: BehaviorType;
}

const Template: Story<Props> = (props): TemplateResult => {
  toggleBehavior(props.behavior);
  return html` <oryx-checkout-delivery></oryx-checkout-delivery> `;
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
