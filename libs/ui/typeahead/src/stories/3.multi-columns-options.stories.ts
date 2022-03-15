import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const content = html`
    <input value="two" aria-label="label" />
    <div slot="option">
      <div>
        ${['one', 'two', 'tree'].map(
          (i) => html`<oryx-option>${i}</oryx-option>`
        )}
      </div>
      <div>
        ${['four', 'five', 'six'].map(
          (i) => html`<oryx-option>${i}</oryx-option>`
        )}
      </div>
    </div>
  `;
  return html`
    <div class="stories">
      <oryx-typeahead>${content}</oryx-typeahead>
      <oryx-typeahead style="--oryx-popover-visible: 1;">
        ${content}
      </oryx-typeahead>
    </div>

    <style>
      .stories {
        display: flex;
        gap: 10px;
      }
      oryx-typeahead {
        flex: 0 0 350px;
      }
    </style>

    <style>
      [slot='option'] {
        display: flex;
      }

      [slot='option'] > div {
        flex: 0 0 50%;
      }
      oryx-option {
        padding: 10px;
        margin: 5px;
        cursor: pointer;
      }
    </style>
  `;
};

export const MultiColumns = Template.bind({});
