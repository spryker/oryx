import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../constant';
import { AffixOptions } from '../../../input';
import '../../../popover/index';
import { SearchEvent, SearchOptions } from '../../../search';
import { FilterStrategyType, TypeaheadOptions } from '../../../typeahead';
import { branches, states } from '../../../utilities/storybook/';
import '../index';
import { SelectOptions } from '../index';

export default {
  title: `${storybookPrefix}/Form/Select`,
} as Meta;

interface Props
  extends SelectOptions,
    TypeaheadOptions,
    SearchOptions,
    AffixOptions {
  searchIcon?: string;
  maxHeight?: string;
  dataSet?: 'branches' | 'states';
  useSelect?: boolean;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  const data: string[] = props.dataSet === 'branches' ? branches : states;

  const logTypeahead = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.typeahead event', ev.detail.query);
  };
  const logSelect = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.select event', ev.detail.query);
  };
  const logSearch = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.search event', ev.detail.query);
  };

  return html`
    <oryx-select
      style="width:500px;--oryx-popover-maxheight:${props.maxHeight}"
      label="label"
      ?isLoading=${props.isLoading}
      .clearIcon=${props.clearIcon}
      .clearIconPosition=${props.clearIconPosition}
      .clearIconAppearance=${props.clearIconAppearance}
      .prefixFill=${props.prefixFill}
      .suffixFill=${props.suffixFill}
      .filterStrategy=${props.filterStrategy}
      @oryx.typeahead=${logTypeahead}
      @oryx.select=${logSelect}
      @oryx.search=${logSearch}
    >
      ${when(
        props.useSelect,
        () => html` <select>
          ${data.map((option) => html`<option>${option}</option>`)}
        </select>`,
        () => html`
          <input placeholder="filter the list by typing" />
          ${data.map(
            (option) =>
              html`<oryx-option slot="option" value=${option}></oryx-option>`
          )}
        `
      )}
    </oryx-select>
  `;
};

export const SelectDemo = Template.bind({});

SelectDemo.args = {
  dataSet: 'states',
  maxHeight: '300px',
  allowEmptyValue: false,
  useSelect: true,
};
SelectDemo.argTypes = {
  allowEmptyValue: {
    control: { type: 'boolean' },
  },
  useSelect: {
    control: { type: 'boolean' },
  },
  dataSet: {
    options: ['states', 'branches'],
    control: { type: 'select' },
    table: { category: 'Data' },
  },
  maxHeight: {
    control: { type: 'text' },
    table: { category: 'Layout' },
  },
  filterStrategy: {
    options: [
      FilterStrategyType.START_WITH,
      FilterStrategyType.START_OF_WORD,
      FilterStrategyType.CONTAINS,
    ],
    control: { type: 'select' },
    table: { category: 'Filter' },
  },
};
