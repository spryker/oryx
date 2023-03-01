import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { storybookDefaultViewports } from '../../../../../src/utilities';
import { NotificationPosition, NotificationService } from '../../index';
import { generateNotification, removeAllMountedCenters } from '../util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center/Static`,
} as Meta;

const service = new NotificationService();

const Template: Story = (): TemplateResult => {
  removeAllMountedCenters();

  setTimeout(() => {
    service
      .getCenter('#parent')
      .open(generateNotification({ autoClose: false, content: 'Title 1' }));
    service
      .getCenter('#parent')
      .open(generateNotification({ autoClose: false, content: 'Title 2' }));
    service
      .getCenter('#parent')
      .open(generateNotification({ autoClose: false, content: 'Title 3' }));
  }, 0);

  return html`
    <div id="parent">
      <oryx-notification-center
        position=${NotificationPosition.TopStart}
      ></oryx-notification-center>
    </div>
  `;
};

export const TopStart = Template.bind({});

TopStart.parameters = {
  chromatic: {
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
