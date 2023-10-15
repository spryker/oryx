import { OverlaysDecorator } from '@/tools/storybook';
import { expect } from '@storybook/jest';
import { userEvent, waitFor } from '@storybook/testing-library';
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
  return html`
    <script>
      (() => {
        const openNestedModalBtn = document.querySelector(
          '#openNestedModalBtn'
        );

        const nestedModal = document.querySelectorAll('oryx-modal')[1];

        openNestedModalBtn?.addEventListener('click', () => {
          nestedModal?.open();
        });
      })();
    </script>

    ${getModalWithNestedModal(false)}
  `;
};

export const OpenNestedModal = Template.bind({});

OpenNestedModal.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const nestedModal = obj.canvasElement.querySelector(
    'oryx-modal[heading="Nested modal"]'
  ) as ModalComponent;
  const openNestedModalBtn = obj.canvasElement.querySelector(
    '#openNestedModalBtn'
  ) as HTMLButtonElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(openNestedModalBtn);
  await waitFor(() => expect(nestedModal.hasAttribute('open')).toBeTruthy());
};
