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
      <oryx-option slot="option">first</oryx-option>
      <oryx-option slot="option" selected>second</oryx-option>
      <oryx-option
        slot="option"
        style="margin:10px;border: solid 1px rebeccapurple"
        >you can apply custom styles</oryx-option
      >
    </oryx-typeahead>
  `;
};

export const Options = Template.bind({});
