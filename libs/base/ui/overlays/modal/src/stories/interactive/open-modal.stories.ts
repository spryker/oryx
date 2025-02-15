import { OverlaysDecorator } from '@/tools/storybook';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { ModalComponent } from '../../modal.component';
import { getModal } from './common';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Interactive`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <button id="openModalBtn">Open modal</button>
    ${getModal(false)}

    <script>
      (() => {
        const openModalBtn = document.querySelector('#openModalBtn');
        const modal = document.querySelector('oryx-modal');

        openModalBtn.addEventListener('click', () => {
          modal?.open();
        });
      })();
    </script>
  `;
};

export const OpenModal = Template.bind({});

OpenModal.play = async (obj: { canvasElement: HTMLElement }): Promise<void> => {
  const modal = obj.canvasElement.querySelector('oryx-modal') as ModalComponent;
  const openBtn = obj.canvasElement.querySelector(
    '#openModalBtn'
  ) as HTMLButtonElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(openBtn);
  expect(modal.hasAttribute('open')).toBeTruthy();
};
