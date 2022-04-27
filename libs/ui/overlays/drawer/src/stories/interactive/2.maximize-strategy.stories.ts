import { expect } from '@storybook/jest';
import { fireEvent, userEvent, within } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { DrawerComponent } from '../..';
import { storybookPrefix } from '../../../../../.storybook/constant';
import { Position } from '../../../../../utilities/model/common';
import '../../index';
import { toggle, wait } from './util';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/interactive`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <button @click=${(): void => toggle()} data-testid="button">open</button>
    <oryx-drawer position=${Position.END}>
      <div style="padding:20px;">Content</div>
    </oryx-drawer>
  `;
};

export const MaximizeStrategy = Template.bind({});

MaximizeStrategy.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const drawer = obj.canvasElement.querySelector(
    'oryx-drawer'
  ) as DrawerComponent;
  const button = drawer.shadowRoot?.querySelector(
    'button:nth-child(2)'
  ) as HTMLButtonElement;

  await wait(1000);
  userEvent.click(await within(obj.canvasElement).getByTestId('button'));
  await wait(1000);
  userEvent.click(button);
  await wait(500);
  expect(drawer.maximize).toBeTruthy;
  await wait(1000);
  await fireEvent.keyDown(drawer?.dialog, { key: 'Escape' });
  await wait(1000);
  userEvent.click(await within(obj.canvasElement).getByTestId('button'));
  expect(drawer.maximize).toBeFalsy;
};
