import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Guest`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-guest></oryx-checkout-guest>`;
};

export const GuestDemo = Template.bind({});
