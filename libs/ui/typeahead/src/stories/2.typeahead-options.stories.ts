import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchIconPosition,
} from '../../../search';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

interface Props {
  searchIcon: string;
  clearIcon: string;
  searchIconPosition: SearchIconPosition;
  clearIconPosition: ClearIconPosition;
  clearIconAppearance: ClearIconAppearance;
  prefixFill: boolean;
  suffixFill: boolean;
}

const Template: Story<Props> = ({ ...options }: Props): TemplateResult => {
  return html`
    <div class="stories">
      <oryx-typeahead .options=${options}>
        <input value="value" aria-label="label" />
        <oryx-option slot="option">first</oryx-option>
        <oryx-option slot="option" selected>second</oryx-option>
        <oryx-option
          slot="option"
          style="margin:10px;border: solid 1px rebeccapurple"
          >you can apply custom styles</oryx-option
        >
      </oryx-typeahead>
      <oryx-typeahead .options=${options} style="--oryx-popover-visible: 1;">
        <input value="value" aria-label="label" />
        <oryx-option slot="option">first</oryx-option>
        <oryx-option slot="option" selected>second</oryx-option>
        <oryx-option
          slot="option"
          style="margin:10px;border: solid 1px rebeccapurple"
          >you can apply custom styles</oryx-option
        >
      </oryx-typeahead>
    </div>

    <style>
      .stories {
        display: flex;
        gap: 10px;
      }
      oryx-typeahead {
        flex: 0 0 350px;
      }
    </style>
  `;
};

export const Options = Template.bind({});
Options.argTypes = {
  searchIcon: {
    control: { type: 'text' },
    defaultValue: 'search',
  },
  clearIcon: {
    control: { type: 'text' },
    defaultValue: 'remove',
  },
  searchIconPosition: {
    options: ['PREFIX', 'SUFFIX', 'NONE'],
    control: { type: 'select' },
    defaultValue: 'PREFIX',
  },
  clearIconPosition: {
    options: ['AFTER', 'SUFFIX', 'NONE'],
    control: { type: 'select' },
    defaultValue: 'AFTER',
  },
  clearIconAppearance: {
    options: ['HOVER', 'TOGGLE', 'SHOW'],
    control: { type: 'select' },
    defaultValue: 'SHOW',
  },
  prefixFill: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  suffixFill: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
};
