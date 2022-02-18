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
        <p slot="loading">
          This is custom content projected in the <code>loading</code> slot.
          This will omit the default styling, but you're in full control.
        </p>
        <p slot="loading">
          No need to set the <code>isLoading</code> flag when light dom is
          projected in the <code>loading</code> slot
        </p>
      </oryx-typeahead>

      <oryx-typeahead style="--oryx-popover-visible: 1;">
        <input value="value" aria-label="label" />
        <p slot="loading">
          This is custom content projected in the <code>loading</code> slot.
          This will omit the default styling, but you're in full control.
        </p>
        <p slot="loading">
          No need to set the <code>isLoading</code> flag when light dom is
          projected in the <code>loading</code> slot
        </p>
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

      p {
        margin: 10px;
      }
    </style>
  `;
};

export const CustomLoader = Template.bind({});
