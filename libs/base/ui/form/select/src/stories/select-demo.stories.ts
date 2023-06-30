import { branches, getAppIcons, states } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { PopoverSelectEvent } from '@spryker-oryx/ui/popover';
import {
  ClearIconAppearance,
  SearchAttributes,
  SearchEventDetail,
  SearchIconPosition,
} from '@spryker-oryx/ui/searchbox';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';
import { AffixOptions } from '../../../../form/input';
import {
  FilterStrategyType,
  TypeaheadOptions,
} from '../../../../search/typeahead';

export default {
  title: `${storybookPrefix}/Form/Select`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props extends TypeaheadOptions, SearchAttributes, AffixOptions {
  searchIcon?: string;
  maxHeight?: string;
  dataSet?: 'branches' | 'states';
  useSelect?: boolean;
  selected?: string;
  floatLabel?: boolean;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  const data: string[] = props.dataSet === 'branches' ? branches : states;

  const logTypeahead = (ev: CustomEvent<SearchEventDetail>): void => {
    console.log('oryx.typeahead event', ev.detail.query);
  };
  const logSelect = (ev: CustomEvent<PopoverSelectEvent>): void => {
    console.log(
      'oryx.select event',
      (ev.detail.selected as HTMLOptionElement).value
    );
  };
  const logSearch = (ev: CustomEvent<SearchEventDetail>): void => {
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
        ?floatLabel=${props.floatLabel}
        label="Select with options"
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
          ${when(
            !props.floatLabel,
            () => html` <option value="" hidden>Select an option</option> `
          )}
          ${data.map(
            (option) =>
              html`<option ?selected=${props.selected === option}>
                ${option}
              </option>`
          )}
        </select>
      </oryx-select>

      <oryx-select
        ?floatLabel=${props.floatLabel}
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

SelectDemo.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};

SelectDemo.args = {
  maxHeight: '300px',
  clearIcon: IconTypes.Remove,
  clearIconAppearance: ClearIconAppearance.Hover,
  prefixFill: false,
  suffixFill: false,
  floatLabel: false,
};

SelectDemo.argTypes = {
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
    options: getAppIcons(),
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  searchIconPosition: {
    options: [
      SearchIconPosition.Prefix,
      SearchIconPosition.Suffix,
      SearchIconPosition.None,
    ],
    control: { type: 'select' },
    table: { category: 'Layout' },
  },
  clearIconAppearance: {
    options: [
      ClearIconAppearance.Hover,
      ClearIconAppearance.Toggle,
      ClearIconAppearance.Show,
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
