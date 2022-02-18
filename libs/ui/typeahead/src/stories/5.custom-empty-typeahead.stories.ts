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
        <p slot="empty">
          This is custom content projected in the <code>empty</code> slot.
          <br />
          This will omit the default styling, but you're in full control.
        </p>
        <p slot="empty">
          You do not need to set the <code>isEmpty</code> flag when you project
          custom content.
        </p>
      </oryx-typeahead>

      <oryx-typeahead style="--oryx-popover-visible: 1;">
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

export const EmptyContent = Template.bind({});
