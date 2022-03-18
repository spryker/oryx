import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';
import { Types } from '../notification.model';
import { bodyBackgroundColor } from './utils';

export default {
  title: `${storybookPrefix}/Notification/Light`,
} as Meta;

const Template: Story = ({ bodyBackgroundColor }): TemplateResult => {
  return html`
    <style>
      body {
        background: ${bodyBackgroundColor};
      }
      oryx-notification {
        margin-bottom: 18px;
      }
    </style>
    <oryx-notification type="${Types.SUCCESS}">
      <span>Success</span><span>Success text</span>
    </oryx-notification>
    <oryx-notification type="${Types.WARNING}">
      <span>Warning</span><span>Warning text</span>
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}">
      <span>Error</span><span>Error text</span>
    </oryx-notification>
    <oryx-notification type="${Types.INFO}">
      <span>Info</span><span>Info text</span>
    </oryx-notification>
  `;
};
export const Subtext = Template.bind({});
Subtext.argTypes = {
  bodyBackgroundColor,
};
