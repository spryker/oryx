import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Opening hours`,
  args: {},
  argTypes: {},
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story = (): TemplateResult => {
  return html`<oryx-merchant-opening-hours
      merchant="1"
    ></oryx-merchant-opening-hours>

    <oryx-merchant-opening-hours merchant="2"></oryx-merchant-opening-hours>`;
};

export const Static = Template.bind({});
