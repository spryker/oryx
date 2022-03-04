import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { sideBySide, states } from '../../../utilities/storybook';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Filters`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const compOptions = { filter: true, filterStrategy: 0 };
  return sideBySide(html`
    <oryx-typeahead .options=${compOptions}>
      <input value="m" placeholder="filter the list by typing" />
      ${states.map(
        (state) => html`<oryx-option .value=${state}></oryx-option>`
      )}
    </oryx-typeahead>
  `);
};

export const StartWith = Template.bind({});
