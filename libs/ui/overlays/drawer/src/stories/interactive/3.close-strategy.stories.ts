import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';
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
    <button
      @click=${(): void => {
        toggle();
      }}
      data-testid="button"
    >
      open
    </button>
    <oryx-drawer position=${Position.END}>
      <div style="padding:20px;">Content</div>
    </oryx-drawer>
  `;
};

export const CloseStrategy = Template.bind({});

CloseStrategy.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const drawer = obj.canvasElement.querySelector(
    'oryx-drawer'
  ) as DrawerComponent;
  const button = drawer.shadowRoot?.querySelector(
    'button:nth-child(1)'
  ) as HTMLButtonElement;

  await wait(1000);
  userEvent.click(await within(obj.canvasElement).getByTestId('button'));
  await wait(0);
  expect(drawer.dialog?.open).toBeTruthy;
  await wait(2000);
  userEvent.click(button);
  expect(drawer.dialog?.open).toBeFalsy;
};
