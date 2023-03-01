import { resolve } from '@spryker-oryx/di';
import { NotificationService } from '@spryker-oryx/site';
import { Types } from '@spryker-oryx/ui/notification';
import {
  NotificationPosition,
  NotificationStrategy,
} from '@spryker-oryx/ui/notification-center';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { SiteNotificationCenterOptions } from '../../../../../../dist/libs/domain/site/notification-center/src/notification-center.model';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Notification Center`,
  argTypes: {
    position: {
      options: [
        NotificationPosition.TopStart,
        NotificationPosition.TopCenter,
        NotificationPosition.TopEnd,
        NotificationPosition.BottomStart,
        NotificationPosition.BottomCenter,
        NotificationPosition.BottomEnd,
      ],
      control: { type: 'radio' },
      description: 'Position in which to display site error notifications.',
    },
    type: {
      options: Object.values(Types),
      control: { type: 'radio' },
      description: 'Type of notification to display.',
      table: { category: 'demo' },
    },
  },
  args: {
    position: NotificationPosition.TopEnd,
    type: Types.INFO,
  },
} as Meta;

const emitMessage = (option: NotificationStrategy): void => {
  resolve(NotificationService).push(option);
};

const Template: Story<SiteNotificationCenterOptions & { type: Types }> = (
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
    <oryx-site-notification-center
      .options=${{ position: props.position }}
    ></oryx-site-notification-center>`;
};

export const Demo = Template.bind({});
