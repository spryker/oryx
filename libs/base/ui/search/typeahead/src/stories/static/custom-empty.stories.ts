import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/empty`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`<oryx-typeahead>
    <input value="value" aria-label="label" />
    <p slot="empty">
      This is custom content projected in the <code>empty</code> slot.
      <br />
      This will omit the default styling, but you're in full control.
    </p>
    <p slot="empty">
      You do not need to set the <code>isEmpty</code> flag when you project
      custom content.
    </p>
  </oryx-typeahead>`);
};

export const EmptyContent = Template.bind({});
