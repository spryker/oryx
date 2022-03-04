import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { sideBySide } from '../../../utilities/storybook';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/form/Select`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const compOptions = { label: 'select', emptyOption: true };
  const selectOptions = ['Red', 'Green', 'Blue'];

  return sideBySide(html`
    <oryx-select .options=${compOptions}>
      <select>
        ${selectOptions.map(
          (value) =>
            html`<option ?selected=${value === 'Green'}>${value}</option>`
        )}
      </select>
    </oryx-select>
  `);
};

export const PreSelected = Template.bind({});
