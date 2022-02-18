import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div class="stories">
      <oryx-typeahead>
        <input value="value" aria-label="label" />
        ${'123456789'
          .split('')
          .map((i) => html`<oryx-option slot="option">${i}</oryx-option>`)}
      </oryx-typeahead>

      <oryx-typeahead style="--oryx-popover-visible: 1;" up>
        <input value="value" aria-label="label" />
        ${'123456789'
          .split('')
          .map((i) => html`<oryx-option slot="option">${i}</oryx-option>`)}
      </oryx-typeahead>
    </div>

    <style>
      .stories {
        display: flex;
        gap: 10px;
      }
      oryx-typeahead {
        flex: 0 0 350px;
        margin-top: 400px;
      }
    </style>
  `;
};

export const DropUpOptions = Template.bind({});
