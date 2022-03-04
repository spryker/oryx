import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { sideBySide, states } from '../../../utilities/storybook/';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/Search/typeahead/filter`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const compOptions = { filter: true, filterStrategy: 2 };

  return sideBySide(html`
    <oryx-select .options=${compOptions}>
      <input value="a" placeholder="filter the list by typing" />
      ${states.map(
        (state) => html`<oryx-option .value=${state}></oryx-option>`
      )}
    </oryx-select>
  `);
};

export const Contains = Template.bind({});
