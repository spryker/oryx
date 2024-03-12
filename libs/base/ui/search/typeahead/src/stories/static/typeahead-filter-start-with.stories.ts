import { sideBySide, states } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { FilterStrategyType } from '../../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Filter`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-typeahead
      ?filter=${true}
      filterStrategy=${FilterStrategyType.START_WITH}
    >
      <input value="Arizona" placeholder="filter the list by typing" />
      ${states.map((state) => html`<oryx-option value=${state}></oryx-option>`)}
    </oryx-typeahead>
  `);
};

export const StartWith = Template.bind({});
