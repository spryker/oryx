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
    <oryx-notification type="${Types.SUCCESS}" floating>
      Success
    </oryx-notification>
    <oryx-notification type="${Types.WARNING}" floating>
      Warning
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" floating>
      Error
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" floating> Info </oryx-notification>
  `;
};
export const Floating = Template.bind({});
Floating.argTypes = {
  bodyBackgroundColor,
};
