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
  const content = html`
    <input value="20" aria-label="label" />
    ${Array.from({ length: 250 }, (_, x) => x + 1).map(
      (item) => html`<oryx-option slot="option">${item}</oryx-option>`
    )}
  `;
  return html`
    <div class="stories">
      <oryx-typeahead .options=${options}>${content}</oryx-typeahead>
      <oryx-typeahead .options=${options} style="--oryx-popover-visible: 1;"
        >${content}</oryx-typeahead
      >
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

export const ManyOptions = Template.bind({});
ManyOptions.argTypes = {
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
