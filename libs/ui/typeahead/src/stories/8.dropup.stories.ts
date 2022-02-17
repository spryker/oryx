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
    <oryx-typeahead style="margin-top: 400px">
      <input value="value is required to show options" />
      ${'123456789'
        .split('')
        .map((i) => html`<oryx-option slot="option">${i}</oryx-option>`)}
    </oryx-typeahead>
  `;
};

export const DropUpOptions = Template.bind({});
