import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const compOptions = { label: 'select', emptyOption: true };
  const selectOptions = ['Red', 'Green', 'Blue'];
  return html`
    <div class="stories">
      <oryx-select .options=${compOptions}>
        <select>
          ${selectOptions.map(
            (value) =>
              html`<option ?selected=${value === 'Green'}>${value}</option>`
          )}
        </select>
      </oryx-select>
      <oryx-select .options=${compOptions} style="--oryx-popover-visible: 1;">
        <select>
          ${selectOptions.map(
            (value) =>
              html`<option ?selected=${value === 'Green'}>${value}</option>`
          )}
        </select>
      </oryx-select>
    </div>

    <style>
      .stories {
        display: flex;
        gap: 10px;
      }
      oryx-select {
        flex: 0 0 350px;
      }
    </style>
  `;
};

export const PreSelected = Template.bind({});
