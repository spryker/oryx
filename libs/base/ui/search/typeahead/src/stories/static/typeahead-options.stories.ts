import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Options`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const content = html`
    <input value="second" aria-label="label" />
    <oryx-option>first</oryx-option>
    <oryx-option>second</oryx-option>
    <oryx-option style="margin:10px;border: solid 1px rebeccapurple"
      >you can apply custom styles</oryx-option
    >
  `;
  return sideBySide(html`<oryx-typeahead>${content}</oryx-typeahead>`);
};

export const Options = Template.bind({});
