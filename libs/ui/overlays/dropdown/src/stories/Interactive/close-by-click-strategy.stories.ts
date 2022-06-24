import { wait } from '@spryker-oryx/typescript-utils';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { DropdownComponent } from '../..';
import { storybookPrefix } from '../../../../../.constants';
import { OverlaysDecorator } from '../../../../../utilities/storybook';
import '../../index';
import { renderOptions } from '../utils';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Interactive`,
  decorators: [OverlaysDecorator(600, 400)],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` <oryx-dropdown open> ${renderOptions()} </oryx-dropdown> `;
};

export const CloseByClick = Template.bind({});

CloseByClick.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const dropdown = obj.canvasElement.querySelector(
    'oryx-dropdown'
  ) as DropdownComponent;

  await wait(1000);
  userEvent.click(dropdown);
  await wait(500);
  expect(dropdown.hasAttribute('open')).toBe(false);
};
