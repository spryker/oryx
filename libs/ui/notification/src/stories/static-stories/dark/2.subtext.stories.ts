import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../../index';
import { Schemes, Types } from '../../../notification.model';
import { bodyBackgroundColor } from '../../util';

export default {
  title: `${storybookPrefix}/Notification/Static/Dark`,
} as Meta;

const Template: Story = ({
  backgroundColor = bodyBackgroundColor.options[0],
}): TemplateResult => {
  return html`
    <style>
      body {
        background: ${backgroundColor};
      }
      oryx-notification {
        margin-bottom: 18px;
      }
    </style>
    <oryx-notification type="${Types.SUCCESS}" scheme="${Schemes.DARK}">
      Success
      <span slot="subtext">Success text</span>
    </oryx-notification>
    <oryx-notification type="${Types.WARNING}" scheme="${Schemes.DARK}">
      Warning
      <span slot="subtext">Warning text</span>
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" scheme="${Schemes.DARK}">
      Error
      <span slot="subtext">Error text</span>
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" scheme="${Schemes.DARK}">
      Info
      <span slot="subtext">Info text</span>
    </oryx-notification>
  `;
};
export const Subtext = Template.bind({});
Subtext.argTypes = {
  backgroundColor: bodyBackgroundColor,
};
