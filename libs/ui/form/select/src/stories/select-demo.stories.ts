import '@spryker-oryx/ui/popover';
import { PopoverSelectEvent } from '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { AffixOptions } from '../../../../form/input';
import { IconTypes } from '../../../../graphical/icon';
import {
  ClearIconAppearance,
  SearchEvent,
  SearchOptions,
} from '../../../../search/searchbox';
import {
  FilterStrategyType,
  TypeaheadOptions,
} from '../../../../search/typeahead';
import { branches, states } from '../../../../utilities/storybook';
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
  selected?: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  const data: string[] = props.dataSet === 'branches' ? branches : states;

  const logTypeahead = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.typeahead event', ev.detail.query);
  };
  const logSelect = (ev: CustomEvent<PopoverSelectEvent>): void => {
    console.log(
      'oryx.select event',
      (ev.detail.selected as HTMLOptionElement).value
    );
  };
  const logSearch = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.searchbox event', ev.detail.query);
  };

  return html`
    <style>
      :root {
        --oryx-popover-maxheight: ${props.maxHeight};
      }
      oryx-select {
        width: 50%;
        margin: 24px 0;
      }
    </style>

    <div
      @oryx.typeahead=${logTypeahead}
      @oryx.select=${logSelect}
      @oryx.search=${logSearch}
    >
      <oryx-select
        label="Select with options"
        ?allowEmptyValue=${props.allowEmptyValue}
        clearIconAppearance=${props.clearIconAppearance}
        filterStrategy=${props.filterStrategy}
        ?prefixFill=${props.prefixFill}
        ?suffixFill=${props.suffixFill}
        clearIcon=${props.clearIcon}
        clearIconPosition=${props.clearIconPosition}
        searchIconPosition=${props.searchIconPosition ?? 'None'}
        contenteditable="false"
      >
        <select required>
          <option value="" hidden>Select an option</option>
          ${data.map(
            (option) =>
              html`<option ?selected=${props.selected === option}>
                ${option}
              </option>`
          )}
        </select>
      </oryx-select>

      <oryx-select
        label="input with options"
        clearIconAppearance=${props.clearIconAppearance}
        filterStrategy=${props.filterStrategy}
        ?prefixFill=${props.prefixFill}
        ?suffixFill=${props.suffixFill}
        clearIcon=${props.clearIcon}
        clearIconPosition=${props.clearIconPosition}
        searchIconPosition=${props.searchIconPosition ?? 'None'}
      >
        <input
          required
          placeholder=${props.filterStrategy
            ? 'filter the list by typing'
            : 'Select an option'}
        />
        ${data.map(
          (option) =>
            html`<oryx-option slot="option" value=${option}></oryx-option>`
        )}
      </oryx-select>
    </div>
  `;
};

export const SelectDemo = Template.bind({});

SelectDemo.args = {
  maxHeight: '300px',
  allowEmptyValue: true,
  clearIcon: IconTypes.Remove,
  clearIconAppearance: ClearIconAppearance.HOVER,
  prefixFill: false,
  suffixFill: false,
};

SelectDemo.argTypes = {
  allowEmptyValue: {
    control: { type: 'boolean' },
    table: { category: 'Select only' },
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
    table: { category: 'Filtering' },
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
  clearIconAppearance: {
    options: [
      ClearIconAppearance.HOVER,
      ClearIconAppearance.TOGGLE,
      ClearIconAppearance.SHOW,
    ],
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

  selected: {
    control: { type: 'select' },
    table: { category: 'Select only' },
    options: states,
  },
};
