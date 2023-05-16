import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking In Progress Modal`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<script>
      (() => {
        const modalBtn = document.querySelector('#modalBtn');

        modalBtn?.addEventListener('click', () => {
          const modal = document
            .querySelector('oryx-picking-in-progress-modal')
            ?.renderRoot.querySelector('oryx-modal');
          modal?.open();
        });
      })();
    </script>

    <button id="modalBtn">Open modal</button>

    <oryx-picking-in-progress-modal></oryx-picking-in-progress-modal> `;
};

export const Demo = Template.bind({});
