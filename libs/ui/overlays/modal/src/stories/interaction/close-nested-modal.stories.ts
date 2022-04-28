import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';
import { ModalComponent } from '../../modal.component';
import { getModalWithNestedModal } from './common';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Interaction`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` ${getModalWithNestedModal(true)} `;
};

export const CloseNestedModal = Template.bind({});

CloseNestedModal.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const nestedModal = obj.canvasElement.querySelector(
    'oryx-modal[header="Nested modal"]'
  ) as ModalComponent;
  const closeNestedModalBtn = nestedModal.shadowRoot?.querySelector(
    'button[value=cancel]'
  ) as HTMLButtonElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(closeNestedModalBtn);
  await new Promise((r) => setTimeout(r, 1000));

  expect(nestedModal.hasAttribute('open')).toBeFalsy();
};
