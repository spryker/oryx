import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Schedule`,
  args: {},
  argTypes: {},
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story = (): TemplateResult => {
  return html` <oryx-merchant-schedule merchant="1"></oryx-merchant-schedule>

    <oryx-merchant-schedule merchant="2"></oryx-merchant-schedule>

    <oryx-merchant-schedule merchant="3"></oryx-merchant-schedule>`;
};

export const Static = Template.bind({});
