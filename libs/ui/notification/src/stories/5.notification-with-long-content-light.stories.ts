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
    <oryx-notification type="${Types.SUCCESS}" closable>
      <span
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor</span
      >
      <span
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.</span
      >
    </oryx-notification>
  `;
};
export const NotificationWithLongContent = Template.bind({});
NotificationWithLongContent.argTypes = {
  bodyBackgroundColor,
};
