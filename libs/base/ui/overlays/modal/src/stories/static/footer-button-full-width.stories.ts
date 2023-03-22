import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { OverlaysDecorator } from '../../../../../src/utilities';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <script>
      (() => {
        const openDefaultModalBtn = document.querySelector(
          '#openDefaultModalBtn'
        );
        const openFullWidthModalBtn = document.querySelector(
          '#openFullWidthModalBtn'
        );
        const openTwoModalBtn = document.querySelector('#openTwoModalBtn');

        const defaultModal = document.querySelector('oryx-modal');
        const fullWidthModal = document.querySelectorAll('oryx-modal')[1];
        const twoModal = document.querySelectorAll('oryx-modal')[2];

        openDefaultModalBtn?.addEventListener('click', () => {
          defaultModal?.open();
        });

        openFullWidthModalBtn?.addEventListener('click', () => {
          fullWidthModal?.open();
        });

        openTwoModalBtn?.addEventListener('click', () => {
          twoModal?.open();
        });
      })();
    </script>

    <button id="openDefaultModalBtn">Open default</button>
    <button id="openFullWidthModalBtn">Open full width</button>
    <button id="openTwoModalBtn">Open two buttons</button>
    <oryx-modal enableFooter>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </oryx-modal>
    <oryx-modal enableFooter footerButtonFullWidth>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </oryx-modal>
    <oryx-modal enableCloseButtonInHeader enableFooter footerButtonFullWidth>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
      <oryx-button slot="footer">
        <button>Save</button>
      </oryx-button>
      <oryx-button slot="footer">
        <button>Ok</button>
      </oryx-button>
    </oryx-modal>
  `;
};

export const FooterButtonFullWidth = Template.bind({});
