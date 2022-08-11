import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { Schemes, Types } from '../../../notification.model';
import { bodyBackgroundColor } from '../../util';

export default {
  title: `${storybookPrefix}/Notification/Static/Light`,
} as Meta;

const longTitle =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim';
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const Template: Story = ({ backgroundColor }): TemplateResult => {
  return html`
    <style>
      body {
        background: ${backgroundColor};
      }
      oryx-notification {
        margin-bottom: 18px;
      }
    </style>
    <oryx-notification
      type="${Types.SUCCESS}"
      scheme="${Schemes.LIGHT}"
      closable
    >
      ${longTitle}
      <span slot="subtext">${longText}</span>
    </oryx-notification>
    <oryx-notification
      type="${Types.WARNING}"
      scheme="${Schemes.LIGHT}"
      closable
    >
      ${longTitle}
      <span slot="subtext">${longText}</span>
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" scheme="${Schemes.LIGHT}" closable>
      ${longTitle}
      <span slot="subtext">${longText}</span>
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" scheme="${Schemes.LIGHT}" closable>
      ${longTitle}
      <span slot="subtext">${longText}</span>
    </oryx-notification>
  `;
};
export const Truncated = Template.bind({});
Truncated.args = {
  backgroundColor: bodyBackgroundColor.options[0],
};
Truncated.argTypes = {
  backgroundColor: bodyBackgroundColor,
};
