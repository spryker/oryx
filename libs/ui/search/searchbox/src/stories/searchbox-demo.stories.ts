import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { IconTypes } from '../../../../Graphical/icon';
import '../index';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchIconPosition,
} from '../index';

export default {
  title: `${storybookPrefix}/Search/SearchBox`,
} as Meta;

type Props = {
  searchIcon: string;
  clearIcon: string;
  searchIconPosition: SearchIconPosition;
  clearIconPosition: ClearIconPosition;
  clearIconAppearance: ClearIconAppearance;
  prefixFill: boolean;
  suffixFill: boolean;
  disabled: boolean;
  readonly: boolean;
  value: string;
};

const Template: Story<Props> = ({ ...options }: Props): TemplateResult => {
  return html`
    <div style="width:300px">
      <oryx-search
        label="search"
        searchIcon=${options.searchIcon}
        clearIcon=${options.clearIcon}
        searchIconPosition=${options.searchIconPosition}
        clearIconPosition=${options.clearIconPosition}
        clearIconAppearance=${options.clearIconAppearance}
        ?prefixFill=${options.prefixFill}
        ?suffixFill=${options.suffixFill}
      >
        <input
          placeholder="Search..."
          value=${options.value}
          ?disabled=${options.disabled}
          ?readonly=${options.readonly}
        />
      </oryx-search>
    </div>
  `;
};
export const SearchboxDemo = Template.bind({});

SearchboxDemo.args = {
  value: '',
  searchIcon: IconTypes.Search,
  clearIcon: IconTypes.Remove,
  searchIconPosition: SearchIconPosition.PREFIX,
  clearIconPosition: ClearIconPosition.AFTER,
  clearIconAppearance: ClearIconAppearance.SHOW,
  prefixFill: false,
  suffixFill: false,
  disabled: false,
  readonly: false,
};

SearchboxDemo.argTypes = {
  value: {
    control: { type: 'text' },
  },
  searchIcon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  clearIcon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  searchIconPosition: {
    options: ['PREFIX', 'SUFFIX', 'NONE'],
    control: { type: 'select' },
  },
  clearIconPosition: {
    options: ['AFTER', 'SUFFIX', 'NONE'],
    control: { type: 'select' },
  },
  clearIconAppearance: {
    options: ['HOVER', 'TOGGLE', 'SHOW'],
    control: { type: 'select' },
  },
  prefixFill: {
    control: { type: 'boolean' },
  },
  suffixFill: {
    control: { type: 'boolean' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  readonly: {
    control: { type: 'boolean' },
  },
};
