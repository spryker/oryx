import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Picking list item/Static`,
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h4>With cart note</h4>
    <oryx-picking-picking-list-item
      pickingListId="withCartNote"
    ></oryx-picking-picking-list-item>

    <h4>Without cart note</h4>
    <oryx-picking-picking-list-item
      pickingListId="withoutCartNote"
    ></oryx-picking-picking-list-item>
  `;
};

export const Variants = Template.bind({});
