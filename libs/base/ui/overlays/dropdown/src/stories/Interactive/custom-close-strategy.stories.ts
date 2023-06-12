import { OverlaysDecorator } from '@/tools/storybook';
import { wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { fireEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { DropdownComponent } from '../../index';

import { renderCustomContent } from '../utils';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Interactive`,
  decorators: [OverlaysDecorator(600, 400)],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <oryx-dropdown open> ${renderCustomContent()} </oryx-dropdown> `;
};

export const CustomClose = Template.bind({});

CustomClose.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const dropdown = obj.canvasElement.querySelector(
    'oryx-dropdown'
  ) as DropdownComponent;
  const closeButton = dropdown.querySelector(
    '.custom-content button[close-popover]'
  );

  await wait(1000);
  fireEvent.mouseUp(closeButton as Element);
  await wait(500);
  expect(dropdown.hasAttribute('open')).toBe(false);
};
