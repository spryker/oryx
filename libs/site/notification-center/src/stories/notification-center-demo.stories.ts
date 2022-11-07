import { resolve } from '@spryker-oryx/injector';
import { NotificationService } from '@spryker-oryx/site';
import { Types } from '@spryker-oryx/ui/notification';
import {
  NotificationStrategy,
  Positions,
} from '@spryker-oryx/ui/notification-center';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { SiteNotificationCenterOptions } from '../notification-center.model';

export default {
  title: `${storybookPrefix}/Notification Center`,
  argTypes: {
    position: {
      options: Object.values(Positions),
      control: { type: 'radio' },
      description: 'Position in which to display site error notifications.',
    },
    type: {
      options: Object.values(Types),
      control: { type: 'radio' },
      description: 'Type of notification to display.',
    },
  },
  args: {
    position: Positions.TOP_END,
    type: Types.INFO,
  },
} as Meta;

const emitMessage = (option: NotificationStrategy): void => {
  resolve(NotificationService).set(option);
};

const Template: Story<SiteNotificationCenterOptions> = (
  props
): TemplateResult => {
  const message = {
    content: 'Title',
    subtext: 'Message',
    type: props.type,
  };
  return html`<div class="buttons">
      <button @click=${() => emitMessage(message)}>emit message</button>
    </div>
    <site-notification-center
      .options=${{ position: props.position }}
    ></site-notification-center>`;
};

export const SiteNotificationCenterDemo = Template.bind({});
