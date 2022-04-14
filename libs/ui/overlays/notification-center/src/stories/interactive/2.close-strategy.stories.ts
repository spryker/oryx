import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { NotificationCenterComponent } from '../..';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';
import { Positions } from '../../notification-center.model';
import { getNotification, open, wait } from './util';

export default {
  title: `${storybookPrefix}/Overlays/NotificationCenter/interactive`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-notification-center position=${Positions.TOP_END}>
    </oryx-notification-center>
  `;
};

export const CloseStrategy = Template.bind({});

CloseStrategy.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const center = obj.canvasElement.querySelector(
    'oryx-notification-center'
  ) as NotificationCenterComponent;

  open({ autoClose: false });
  await wait(0);
  expect(getNotification(center)).toBeDefined;
  await wait(1000);
  userEvent.click(
    getNotification(center)?.renderRoot?.querySelector('button') as Element
  );
  await wait(0);
  expect(getNotification(center)).toBeNull;
};
