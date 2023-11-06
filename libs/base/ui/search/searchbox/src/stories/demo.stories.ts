import { getAppIcons } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { AffixOptions } from '@spryker-oryx/ui/input';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchAttributes,
  SearchIconPosition,
} from '../searchbox.model';

export default {
  title: `${storybookPrefix}/Search/SearchBox`,
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    value: '',
    searchIcon: IconTypes.Search,
    clearIcon: IconTypes.Remove,
    backIcon: IconTypes.Backward,
    searchIconPosition: SearchIconPosition.Prefix,
    clearIconPosition: ClearIconPosition.After,
    clearIconAppearance: ClearIconAppearance.Show,
    prefixFill: false,
    suffixFill: false,
    disabled: false,
    readonly: false,
  },
  argTypes: {
    value: {
      control: { type: 'text' },
    },
    searchIcon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    clearIcon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    backIcon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    searchIconPosition: {
      options: [
        SearchIconPosition.Prefix,
        SearchIconPosition.Suffix,
        SearchIconPosition.None,
      ],
      control: { type: 'select' },
    },
    clearIconPosition: {
      options: [
        ClearIconPosition.After,
        ClearIconPosition.Suffix,
        ClearIconPosition.None,
      ],
      control: { type: 'select' },
    },
    clearIconAppearance: {
      options: [
        ClearIconAppearance.Hover,
        ClearIconAppearance.Toggle,
        ClearIconAppearance.Show,
      ],
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
  },
} as Meta;

type Props = SearchAttributes &
  AffixOptions & {
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
