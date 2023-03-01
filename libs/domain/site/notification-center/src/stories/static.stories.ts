import { resolve } from '@spryker-oryx/di';
import { NotificationService } from '@spryker-oryx/site';
import { Types } from '@spryker-oryx/ui/notification';
import { NotificationPosition } from '@spryker-oryx/ui/notification-center';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Notification Center/Static`,
} as Meta;

const renderRow = (position: NotificationPosition): TemplateResult =>
  html`<oryx-site-notification-center
    .options=${{ position }}
  ></oryx-site-notification-center>`;

const Template: Story = (): TemplateResult => {
  const notificationService = resolve(NotificationService);
  document
    .querySelectorAll('oryx-site-notification-center')
    .forEach((element) => element.remove());

  setTimeout(() => {
    notificationService.push({
      content: 'Info',
      subtext: '1 Message',
      type: Types.INFO,
    });
    notificationService.push({
      content: 'Success',
      subtext: '2 Message',
      type: Types.SUCCESS,
    });
    notificationService.push({
      content: 'Warning',
      subtext: '3 Message',
      type: Types.WARNING,
    });
    notificationService.push({
      content: 'Error',
      subtext: '4 Message',
      type: Types.ERROR,
    });
  }, 0);

  return html`${[
    NotificationPosition.TopStart,
    NotificationPosition.TopCenter,
    NotificationPosition.TopEnd,
    NotificationPosition.BottomStart,
    NotificationPosition.BottomCenter,
    NotificationPosition.BottomEnd,
  ].map((position) => renderRow(position))}`;
};

export const Positions = Template.bind({});
