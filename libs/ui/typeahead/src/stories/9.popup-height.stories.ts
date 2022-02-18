import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

interface Props {
  maxHeight: string;
}

const Template: Story<Props> = ({ maxHeight }: Props): TemplateResult => {
  return html`
    <div class="stories">
      <oryx-typeahead>
        <input value="value" aria-label="label" />
        <oryx-option slot="option">first</oryx-option>
        <oryx-option slot="option" selected>second</oryx-option>
        <oryx-option slot="option">3rd</oryx-option>
        <oryx-option slot="option">4</oryx-option>
        <oryx-option slot="option">5</oryx-option>
        <oryx-option slot="option">6</oryx-option>
      </oryx-typeahead>

      <oryx-typeahead style="--oryx-popover-visible: 1;">
        <input value="value" aria-label="label" />
        <oryx-option slot="option">first</oryx-option>
        <oryx-option slot="option" selected>second</oryx-option>
        <oryx-option slot="option">3rd</oryx-option>
        <oryx-option slot="option">4</oryx-option>
        <oryx-option slot="option">5</oryx-option>
        <oryx-option slot="option">6</oryx-option>
      </oryx-typeahead>
    </div>

    <style>
      .stories {
        --oryx-popover-maxheight: ${maxHeight};

        display: flex;
        gap: 10px;
      }
      oryx-typeahead {
        flex: 0 0 350px;
      }
    </style>
  `;
};

export const maxHeight = Template.bind({});
maxHeight.args = {
  maxHeight: '250px',
} as Props;
