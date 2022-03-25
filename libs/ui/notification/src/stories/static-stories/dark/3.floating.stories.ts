import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../../index';
import { Schemes, Types } from '../../../notification.model';
import { bodyBackgroundColor } from '../../util';

export default {
  title: `${storybookPrefix}/Notification/Static/Dark`,
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
    <oryx-notification
      type="${Types.SUCCESS}"
      scheme="${Schemes.DARK}"
      floating
    >
      Success
    </oryx-notification>
    <oryx-notification
      type="${Types.WARNING}"
      scheme="${Schemes.DARK}"
      floating
    >
      Warning
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" scheme="${Schemes.DARK}" floating>
      Error
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" scheme="${Schemes.DARK}" floating>
      Info
    </oryx-notification>
  `;
};
export const Floating = Template.bind({});
Floating.argTypes = {
  bodyBackgroundColor,
};
