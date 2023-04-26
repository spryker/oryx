import { IconTypes } from '@spryker-oryx/themes/icons';
import { AffixOptions } from '@spryker-oryx/ui/input';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
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

SearchboxDemo.args = {
  value: '',
  searchIcon: IconTypes.Search,
  clearIcon: IconTypes.Remove,
  backIcon: IconTypes.Back,
  searchIconPosition: SearchIconPosition.Prefix,
  clearIconPosition: ClearIconPosition.After,
  clearIconAppearance: ClearIconAppearance.Show,
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
  backIcon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  searchIconPosition: {
    options: ['prefix', 'suffix', 'none'],
    control: { type: 'select' },
  },
  clearIconPosition: {
    options: ['after', 'suffix', 'none'],
    control: { type: 'select' },
  },
  clearIconAppearance: {
    options: ['hover', 'toggle', 'show'],
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
