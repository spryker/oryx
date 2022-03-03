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
  const input = html`
    <input placeholder="select something from the list" />
    ${states.map((state) => html`<oryx-option>${state}</oryx-option>`)}
  `;
  return html`
    <div class="stories">
      <oryx-select .options=${{ allowEmptyValue: false }}>${input}</oryx-select>
      <oryx-select style="--oryx-popover-visible: 1;">${input}</oryx-select>
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

export const InputBased = Template.bind({});
