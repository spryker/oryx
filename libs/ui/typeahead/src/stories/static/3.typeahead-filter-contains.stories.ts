import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.storybook/constant';
import '../../../../option/src/index';
import { sideBySide, states } from '../../../../utilities/storybook';
import '../../index';
import { FilterStrategyType } from '../../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Filter`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-select ?filter=${true} filterStrategy=${FilterStrategyType.CONTAINS}>
      <input value="a" placeholder="filter the list by typing" />
      ${states.map((state) => html`<oryx-option value=${state}></oryx-option>`)}
    </oryx-select>
  `);
};

export const Contains = Template.bind({});
