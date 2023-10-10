import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Customer note`,
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-picking-customer-note
      pickingListId="withCartNote"
    ></oryx-picking-customer-note>
  `;
};

export const Demo = Template.bind({});
