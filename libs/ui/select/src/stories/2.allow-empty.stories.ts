import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import '../index';
import { SelectOptions } from '../select.model';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const compOptions: SelectOptions = { label: 'select', allowEmptyValue: true };
  const selectOptions = ['Red', 'Green', 'Blue'];
  return html`
    <div class="stories">
      <oryx-select .options=${compOptions}>
        <select>
          ${selectOptions.map((state) => html`<option>${state}</option>`)}
        </select>
      </oryx-select>
      <oryx-select .options=${compOptions} style="--oryx-popover-visible: 1;">
        <select>
          ${selectOptions.map((state) => html`<option>${state}</option>`)}
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

export const AllowEmpty = Template.bind({});
