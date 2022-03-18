import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../index';
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
      Success
    </oryx-notification>
    <oryx-notification type="${Types.WARNING}" closable>
      Warning
    </oryx-notification>
    <oryx-notification type="${Types.ERROR}" closable>
      Error
    </oryx-notification>
    <oryx-notification type="${Types.INFO}" closable> Info </oryx-notification>
  `;
};
export const Closable = Template.bind({});
Closable.argTypes = {
  bodyBackgroundColor,
};
