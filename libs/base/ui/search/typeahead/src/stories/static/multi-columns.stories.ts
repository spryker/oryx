import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Layout`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(
    html`
      <oryx-typeahead>
        <input value="two" aria-label="label" />
        <div slot="option">
          <div>
            ${['one', 'two', 'tree'].map(
              (i) => html`<oryx-option>${i}</oryx-option>`
            )}
          </div>
          <div>
            ${['four', 'five', 'six'].map(
              (i) => html`<oryx-option>${i}</oryx-option>`
            )}
          </div>
        </div>
      </oryx-typeahead>
    `,
    html`<style>
      [slot='option'] {
        display: flex;
      }

      [slot='option'] > div {
        flex: 0 0 50%;
      }
      oryx-option {
        padding: 10px;
        margin: 5px;
        cursor: pointer;
      }
    </style>`
  );
};

export const MultiColumns = Template.bind({});
