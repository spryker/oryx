import { IconTypes } from '@spryker-oryx/theme/icons';
import { AffixOptions } from '@spryker-oryx/ui/input';
import '@spryker-oryx/ui/popover';
import { SearchEvent, SearchOptions } from '@spryker-oryx/ui/searchbox';
import { branches, states } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { FilterStrategyType, TypeaheadOptions } from '../typeahead.model';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

interface Props extends TypeaheadOptions, SearchOptions, AffixOptions {
  searchIcon?: string;
  maxHeight?: string;
  dataSet?: 'branches' | 'states';
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
    <oryx-typeahead
      style="width:500px;--oryx-popover-maxheight:${props.maxHeight}"
      label="label"
      ?isLoading=${props.isLoading}
      searchIcon=${ifDefined(props.searchIcon)}
      clearIcon=${ifDefined(props.clearIcon)}
      searchIconPosition=${props.searchIconPosition}
      clearIconPosition=${props.clearIconPosition}
      clearIconAppearance=${props.clearIconAppearance}
      ?prefixFill=${props.prefixFill}
      ?suffixFill=${props.suffixFill}
      filterStrategy=${props.filterStrategy}
      @oryx.typeahead=${logTypeahead}
      @oryx.select=${logSelect}
      @oryx.search=${logSearch}
    >
      <input value="m" placeholder="filter the list by typing" />
      ${data.map(
        (option) =>
          html`<oryx-option slot="option" value=${option}></oryx-option>`
      )}
    </oryx-typeahead>
  `;
};

export const TypeaheadDemo = Template.bind({});

TypeaheadDemo.args = {
  dataSet: 'branches',
  maxHeight: '300px',
};
TypeaheadDemo.argTypes = {
  dataSet: {
    options: ['states', 'branches'],
    control: { type: 'select' },
    table: { category: 'Data' },
  },
  maxHeight: {
    control: { type: 'text' },
    table: { category: 'Layout' },
  },
  searchIcon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  clearIcon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  searchIconPosition: {
    options: ['PREFIX', 'SUFFIX', 'NONE'],
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  clearIconPosition: {
    options: ['AFTER', 'SUFFIX', 'NONE'],
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  clearIconAppearance: {
    options: ['HOVER', 'TOGGLE', 'SHOW'],
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  prefixFill: {
    control: { type: 'boolean' },
    table: { category: 'Layout' },
  },
  suffixFill: {
    control: { type: 'boolean' },
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
