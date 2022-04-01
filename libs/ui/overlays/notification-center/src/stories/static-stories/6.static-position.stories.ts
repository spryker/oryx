import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import { Types } from '../../../../../notification';
import '../../index';
import { NotificationService } from '../../index';
import { generateNotification, removeAllMountedCenters } from '../util';

export default {
  title: `${storybookPrefix}/Overlays/NotificationCenter/Static`,
} as Meta;

const service = new NotificationService();

const Template: Story = (): TemplateResult => {
  removeAllMountedCenters();

  setTimeout(() => {
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: Types.INFO,
      })
    );
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: Types.INFO,
      })
    );
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: Types.INFO,
      })
    );
    service.getCenter('#parent').open(
      generateNotification({
        autoClose: false,
        content: 'Content',
        type: Types.INFO,
      })
    );
  }, 0);

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
