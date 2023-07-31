import { wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { NotificationCenterComponent } from '../../notification-center.component';
import { NotificationPosition } from '../../notification-center.model';
import { TAG_NAME } from '../../tag';
import { getNotification, open } from './util';

export default {
  title: `${storybookPrefix}/Overlays/Notification Center/Interactive`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-notification-center position=${NotificationPosition.TopEnd}>
    </oryx-notification-center>
  `;
};

export const CloseStrategy = Template.bind({});

CloseStrategy.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const center = obj.canvasElement.querySelector(
    TAG_NAME
  ) as NotificationCenterComponent;
  await wait(1000);
  open({ autoClose: false });
  await wait(0);
  expect(getNotification(center)).toBeDefined;
  await wait(1000);
  userEvent.click(
    getNotification(center)?.renderRoot?.querySelector('oryx-button') as Element
  );
  await wait(0);
  expect(getNotification(center)).toBeNull;
};
