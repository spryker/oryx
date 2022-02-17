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
    <oryx-typeahead>
      <input value="value is required to show options" />
      <div slot="option">first</div>
      <div slot="option" selected>second</div>
      <div slot="option">
        3rd
        <p>Nothing stops you from adding any content</p>
      </div>
    </oryx-typeahead>

    <style>
      div[slot='option'] {
        padding: 10px;
        margin: 10px;
        cursor: pointer;
        border-radius: 15px;
      }
      div[slot='option']:hover,
      [highlight] {
        background-color: red;
      }
      [selected]:after {
        content: ' (selected)';
        color: var(--oryx-color-brand);
      }
    </style>
  `;
};

export const CustomOptions = Template.bind({});
