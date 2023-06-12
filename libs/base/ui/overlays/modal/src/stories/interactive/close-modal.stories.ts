import { OverlaysDecorator } from '@/tools/storybook';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { ModalComponent } from '../../modal.component';
import { getModal } from './common';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Interactive`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html` Background text ${getModal(true)} `;
};

export const CloseModal = Template.bind({});

CloseModal.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const modal = obj.canvasElement.querySelector('oryx-modal') as ModalComponent;
  const closeBtn = modal.shadowRoot?.querySelector(
    'button[value=cancel]'
  ) as HTMLButtonElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(closeBtn);
  await new Promise((r) => setTimeout(r, 1000));

  expect(modal.hasAttribute('open')).toBeFalsy();
};
