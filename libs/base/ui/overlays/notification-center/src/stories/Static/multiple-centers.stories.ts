import { Types } from '@spryker-oryx/ui/notification';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { NotificationPosition, NotificationService } from '../../index';
import { generateNotification, removeAllMountedCenters } from '../util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center/Static`,
} as Meta;

const service = new NotificationService();

const Template: Story = (): TemplateResult => {
  removeAllMountedCenters();

  setTimeout(() => {
    service.getCenter('#parent1').open(
      generateNotification({
        autoClose: false,
        content: 'Center 1',
        type: Types.INFO,
      })
    );
    service.getCenter('#parent2').open(
      generateNotification({
        autoClose: false,
        content: 'Center 2',
        type: Types.SUCCESS,
      })
    );
    service.getCenter('#parent3').open(
      generateNotification({
        autoClose: false,
        content: 'Center 3',
        type: Types.WARNING,
      })
    );
    service.getCenter('#parent4').open(
      generateNotification({
        autoClose: false,
        content: 'Center 4',
        type: Types.ERROR,
      })
    );
  }, 0);

  return html`
    <style>
      oryx-notification-center {
        max-width: 240px;
      }
    </style>
    <div id="parent1">
      <oryx-notification-center
        position=${NotificationPosition.TopEnd}
      ></oryx-notification-center>
    </div>

    <div id="parent2">
      <oryx-notification-center
        position=${NotificationPosition.BottomEnd}
      ></oryx-notification-center>
    </div>

    <div id="parent3">
      <oryx-notification-center
        position=${NotificationPosition.BottomStart}
      ></oryx-notification-center>
    </div>

    <div id="parent4">
      <oryx-notification-center
        position=${NotificationPosition.TopStart}
      ></oryx-notification-center>
    </div>
  `;
};

export const Multiple = Template.bind({});
