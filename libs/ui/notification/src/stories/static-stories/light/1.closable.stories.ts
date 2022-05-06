import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../../index';
import { Schemes, Types } from '../../../notification.model';
import { bodyBackgroundColor } from '../../util';

export default {
  title: `${storybookPrefix}/Notification/Static/Light`,
} as Meta;

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
      Success
    </oryx-notification>
    <oryx-notification
      type="${Types.WARNING}"
      scheme="${Schemes.LIGHT}"
      closable
    >
      Warning
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" scheme="${Schemes.LIGHT}" closable>
      Error
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" scheme="${Schemes.LIGHT}" closable>
      Info
    </oryx-notification>
  `;
};
export const Closable = Template.bind({});
Closable.args = {
  backgroundColor: bodyBackgroundColor.options[0],
};
Closable.argTypes = {
  backgroundColor: bodyBackgroundColor,
};
