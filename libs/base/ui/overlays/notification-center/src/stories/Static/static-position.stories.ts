import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { NotificationService } from '../../index';
import { generateNotification, removeAllMountedCenters } from '../util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <style>
      #parent {
        background: gray;
        padding: 40px;
      }

      p {
        color: white;
        margin-top: 0;
      }
    </style>
    <div id="parent">
      <p>Static parent</p>
      <oryx-notification-center></oryx-notification-center>
    </div>
  `;
};

export const StaticPosition = Template.bind({});

StaticPosition.play = async (): Promise<void> => {
  const service = new NotificationService();

  removeAllMountedCenters();

  (async function () {
    await Promise.all([
      customElements.whenDefined('oryx-notification-center'),
      customElements.whenDefined('oryx-notification'),
    ]);

    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: AlertType.Info,
      })
    );
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: AlertType.Info,
      })
    );
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: AlertType.Info,
      })
    );
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: AlertType.Info,
      })
    );
  })();
};
