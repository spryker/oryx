import {
  OverlaysDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Picking header/Static`,
  decorators: [OverlaysDecorator(320, 568)],
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<h4>With cart note</h4>
    <oryx-picking-header pickingListId="withCartNote"></oryx-picking-header>

    <h4>Without cart note</h4>
    <oryx-picking-header
      pickingListId="withoutCartNote"
    ></oryx-picking-header>`;
};

export const Variants = Template.bind({});
