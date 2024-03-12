import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Loading`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(
    html`<oryx-typeahead>
      <input value="value" aria-label="label" />
      <p slot="loading">
        This is custom content projected in the <code>loading</code> slot. This
        will omit the default styling, but you're in full control.
      </p>
      <p slot="loading">
        No need to set the <code>isLoading</code> flag when light dom is
        projected in the <code>loading</code> slot
      </p>
    </oryx-typeahead>`
  );
};

export const CustomLoader = Template.bind({});
