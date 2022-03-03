import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import '../index';
import { states } from './states';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div class="stories">
      <oryx-select>
        <select>
          ${states.map((state) => html`<option>${state}</option>`)}
        </select>
      </oryx-select>

      <oryx-select style="--oryx-popover-visible: 1;">
        <select>
          ${states.map((state) => html`<option>${state}</option>`)}
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

export const ManyOptions = Template.bind({});
