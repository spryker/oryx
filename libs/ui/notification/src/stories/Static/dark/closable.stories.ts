import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Schemes, Types } from '../../../notification.model';
import { bodyBackgroundColor } from '../../util';

export default {
  title: `${storybookPrefix}/Notification/Static/Dark`,
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
      scheme="${Schemes.DARK}"
      closable
    >
      Success
    </oryx-notification>
    <oryx-notification
      type="${Types.WARNING}"
      scheme="${Schemes.DARK}"
      closable
    >
      Warning
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" scheme="${Schemes.DARK}" closable>
      Error
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" scheme="${Schemes.DARK}" closable>
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
