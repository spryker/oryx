import { HeadingTag } from '@spryker-oryx/ui/heading';
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
  return html` <h3>All</h3>
    <oryx-merchant-schedule merchant="1"></oryx-merchant-schedule>

    <h3>Hours only</h3>
    <oryx-merchant-schedule
      merchant="1"
      .options=${{ type: 'opening-hours' }}
    ></oryx-merchant-schedule>

    <h3>Open dates only</h3>
    <oryx-merchant-schedule
      merchant="1"
      .options=${{ type: 'open-dates' }}
    ></oryx-merchant-schedule>

    <h3>Closed dates only</h3>
    <oryx-merchant-schedule
      merchant="1"
      .options=${{ type: 'closed-dates' }}
    ></oryx-merchant-schedule>

    <h3>Subtitle tag (h4)</h3>
    <oryx-merchant-schedule
      merchant="1"
      .options=${{ tag: HeadingTag.H4 }}
    ></oryx-merchant-schedule>

    <h3>unknown merchant, no schedule</h3>
    <oryx-merchant-schedule merchant="unknown"></oryx-merchant-schedule>`;
};

export const Static = Template.bind({});
