import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { NotificationPosition } from '../../notification-center.model';
import { NotificationService } from '../../service';
import { generateNotification, removeAllMountedCenters } from '../util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <style>
      oryx-notification-center {
        --oryx-notification-max-width: 240px;
      }
    </style>
    <div id="parent1"></div>
    <div id="parent2"></div>
    <div id="parent3"></div>
    <div id="parent4"></div>
    <div id="parent5"></div>
    <div id="parent6"></div>
  `;
};

export const Positions = Template.bind({});

Positions.play = async (): Promise<void> => {
  const service = new NotificationService();

  removeAllMountedCenters();

  (async function () {
    await Promise.all([
      customElements.whenDefined('oryx-notification-center'),
      customElements.whenDefined('oryx-notification'),
    ]);

    const center1 = service.getCenter(
      '#parent1',
      NotificationPosition.TopStart
    );
    const center2 = service.getCenter(
      '#parent2',
      NotificationPosition.TopCenter
    );
    const center3 = service.getCenter('#parent3', NotificationPosition.TopEnd);
    const center4 = service.getCenter(
      '#parent4',
      NotificationPosition.BottomStart
    );
    const center5 = service.getCenter(
      '#parent5',
      NotificationPosition.BottomCenter
    );
    const center6 = service.getCenter(
      '#parent6',
      NotificationPosition.BottomEnd
    );

    center1.open?.(
      generateNotification({ content: 'info', type: AlertType.Info })
    );
    center1.open?.(
      generateNotification({ content: 'success', type: AlertType.Success })
    );
    center1.open?.(
      generateNotification({ content: 'warning', type: AlertType.Warning })
    );
    center1.open?.(
      generateNotification({ content: 'error', type: AlertType.Error })
    );
    center2.open?.(
      generateNotification({ content: 'info', type: AlertType.Info })
    );
    center3.open?.(
      generateNotification({ content: 'info', type: AlertType.Info })
    );
    center4.open?.(
      generateNotification({ content: 'info', type: AlertType.Info })
    );
    center5.open?.(
      generateNotification({ content: 'info', type: AlertType.Info })
    );
    center6.open?.(
      generateNotification({ content: 'info', type: AlertType.Info })
    );
  })();
};
