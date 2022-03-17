import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { sideBySide, states } from '../../../utilities/storybook';
import '../index';
import { FilterStrategyType } from '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Filters`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-typeahead
      ?filter=${true}
      filterStrategy=${FilterStrategyType.START_WITH}
    >
      <input value="m" placeholder="filter the list by typing" />
      ${states.map((state) => html`<oryx-option value=${state}></oryx-option>`)}
    </oryx-typeahead>
  `);
};

export const StartWith = Template.bind({});
