import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div class="stories">
      <oryx-select>
        <select aria-label="label"></select>
      </oryx-select>
      <oryx-select style="--oryx-popover-visible: 1;">
        <select aria-label="label"></select>
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

export const NoOptions = Template.bind({});
