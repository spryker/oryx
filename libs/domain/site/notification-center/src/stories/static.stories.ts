import { resolve } from '@spryker-oryx/di';
import { NotificationService } from '@spryker-oryx/site';
import { Types } from '@spryker-oryx/ui/notification';
import { Positions } from '@spryker-oryx/ui/notification-center';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Notification Center/Static`,
} as Meta;

const renderRow = (position: Positions): TemplateResult =>
  html`<site-notification-center
    .options=${{ position }}
  ></site-notification-center>`;

const Template: Story = (): TemplateResult => {
  const notificationService = resolve(NotificationService);
  document
    .querySelectorAll('site-notification-center')
    .forEach((element) => element.remove());

  setTimeout(() => {
    notificationService.push({
      content: 'Info',
      subtext: '1 Message',
      type: Types.INFO,
    });
    notificationService.set({
      content: 'Success',
      subtext: '2 Message',
      type: Types.SUCCESS,
    });
    notificationService.set({
      content: 'Warning',
      subtext: '3 Message',
      type: Types.WARNING,
    });
    notificationService.set({
      content: 'Error',
      subtext: '4 Message',
      type: Types.ERROR,
    });
  }, 0);

  return html`${Object.values(Positions).map((position) =>
    renderRow(position)
  )}`;
};

export const SiteNotificationCenterPositions = Template.bind({});
