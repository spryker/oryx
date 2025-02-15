import { OverlaysDecorator } from '@/tools/storybook';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { ModalComponent } from '../../modal.component';
import { getModalWithNestedModal } from './common';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Interactive`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` ${getModalWithNestedModal(true)} `;
};

export const CloseNestedModal = Template.bind({});

CloseNestedModal.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const nestedModal = obj.canvasElement.querySelector(
    'oryx-modal[heading="Nested modal"]'
  ) as ModalComponent;
  const closeNestedModalBtn = nestedModal.shadowRoot?.querySelector(
    'button[value=cancel]'
  ) as HTMLButtonElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(closeNestedModalBtn);
  await new Promise((r) => setTimeout(r, 1000));

  expect(nestedModal.hasAttribute('open')).toBeFalsy();
};
