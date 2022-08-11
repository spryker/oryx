import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

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
    <oryx-notification type="${Types.SUCCESS}" scheme="${Schemes.LIGHT}">
      Success
      <span slot="subtext">Success text</span>
    </oryx-notification>
    <oryx-notification type="${Types.WARNING}" scheme="${Schemes.LIGHT}">
      Warning
      <span slot="subtext">Warning text</span>
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" scheme="${Schemes.LIGHT}">
      Error
      <span slot="subtext">Error text</span>
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" scheme="${Schemes.LIGHT}">
      Info
      <span slot="subtext">Info text</span>
    </oryx-notification>
  `;
};
export const Subtext = Template.bind({});
Subtext.args = {
  backgroundColor: bodyBackgroundColor.options[0],
};
Subtext.argTypes = {
  backgroundColor: bodyBackgroundColor,
};
