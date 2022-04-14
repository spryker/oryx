import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.storybook/constant';
import '../../../../popover/index';
import { sideBySide } from '../../../../utilities/storybook';
import '../../index';

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
