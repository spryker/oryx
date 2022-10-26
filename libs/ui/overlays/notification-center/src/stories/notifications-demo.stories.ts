import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Positions } from '../notification-center.model';
import { NotificationService } from '../service';
import { generateRandomNotification } from './util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center`,
} as Meta;

interface Props {
  position?: Positions;
}

const service = new NotificationService();

const Template: Story<Props> = ({
  position = Positions.TOP_END,
}: Props): TemplateResult => {
  const pushSticky = (): void => {
    service
      .getCenter('#parent-with-sticky', position)
      .open(generateRandomNotification());
  };

  const pushStatic = (): void => {
    service.getCenter('#parent-with-static').open(generateRandomNotification());
  };

  return html`
    <style>
      .buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    </style>

    <div class="buttons">
      <button @click=${() => pushStatic()}>push static</button>
      <button @click=${() => pushSticky()}>push sticky</button>
    </div>

    <div id="parent-with-static">
      <oryx-notification-center></oryx-notification-center>
    </div>

    <div id="parent-with-sticky">
      <oryx-notification-center position=${position}></oryx-notification-center>
    </div>
  `;
};

export const NotificationCenterDemo = Template.bind({});
NotificationCenterDemo.args = {
  position: Positions.TOP_END,
};
NotificationCenterDemo.argTypes = {
  position: {
    options: Object.values(Positions),
    control: { type: 'radio' },
  },
};
