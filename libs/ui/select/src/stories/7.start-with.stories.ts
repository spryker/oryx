import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { FilterStrategyType } from '../../../typeahead';
import { branches, sideBySide, states } from '../../../utilities/storybook/';
import '../index';

export default {
  title: `${storybookPrefix}/form/Select/filter`,
} as Meta;

interface Props {
  dataSet: string;
  filterStrategy: FilterStrategyType;
}

const Template: Story<Props> = ({
  dataSet,
  filterStrategy,
}: Props): TemplateResult => {
  const data: string[] = dataSet === 'branches' ? branches : states;

  return sideBySide(html`
    <oryx-select ?filter=${true} filterStrategy=${filterStrategy}>
      <input value="m" placeholder="filter the list by typing" />
      ${data.map((option) => html`<oryx-option value=${option}></oryx-option>`)}
    </oryx-select>
  `);
};

export const StartWith = Template.bind({});

StartWith.args = {
  dataSet: 'states',
  filterStrategy: FilterStrategyType.START_WITH,
};
StartWith.argTypes = {
  filterStrategy: {
    options: [
      FilterStrategyType.START_WITH,
      FilterStrategyType.START_OF_WORD,
      FilterStrategyType.CONTAINS,
    ],
    control: { type: 'select' },
  },
  dataSet: {
    options: ['states', 'branches'],
    control: { type: 'select' },
  },
};
