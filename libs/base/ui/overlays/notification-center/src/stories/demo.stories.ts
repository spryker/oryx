import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { Scheme } from '../../../notification/src';
import {
  NotificationCenterComponentAttributes,
  NotificationPosition,
} from '../notification-center.model';
import { NotificationService } from '../service';
import { generateRandomNotification } from './util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center`,
  args: {
    position: NotificationPosition.TopEnd,
    stackable: true,
    closable: true,
    autoClose: true,
    defaultAutoCloseTime: 8,
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: [
        NotificationPosition.TopStart,
        NotificationPosition.TopCenter,
        NotificationPosition.TopEnd,
        NotificationPosition.BottomStart,
        NotificationPosition.BottomCenter,
        NotificationPosition.BottomEnd,
      ],
    },
    type: {
      control: { type: 'select' },
      options: [
        AlertType.Info,
        AlertType.Success,
        AlertType.Warning,
        AlertType.Error,
      ],
      table: { category: 'Demo' },
    },
    closable: { table: { category: 'Demo' } },
    autoClose: { table: { category: 'Demo' } },
    scheme: {
      control: { type: 'radio' },
      options: [Scheme.Light, Scheme.Dark],
      table: { category: 'Demo' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface DemoProps {
  type?: AlertType;
  scheme?: Scheme;
  closable?: boolean;
}

const service = new NotificationService();

const Template: Story<NotificationCenterComponentAttributes> = (
  props: NotificationCenterComponentAttributes & DemoProps
): TemplateResult => {
  const pushSticky = (): void => {
    service
      .getCenter('#parent-with-sticky', props.position)
      .open(generateRandomNotification(props));
  };

  const pushStatic = (): void => {
    service
      .getCenter('#parent-with-static')
      .open(generateRandomNotification(props));
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
      <oryx-notification-center
        position=${ifDefined(props.position)}
        ?stackable=${props.stackable}
      ></oryx-notification-center>
    </div>
  `;
};

export const Demo = Template.bind({});
