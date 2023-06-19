import { completion } from '@spryker-oryx/search/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SearchBoxOptions } from '../box.model';

export default {
  title: `${storybookPrefix}/SearchBox`,
} as unknown as Meta;

const Template: Story<SearchBoxOptions> = (
  options: SearchBoxOptions
): TemplateResult => {
  return html`
    <style>
      h4 {
        margin-bottom: 8px;
      }

      small {
        display: block;
        margin: 0 0 4px;
      }
    </style>

    <oryx-search-box .options=${options}></oryx-search-box>

    <h4>List of mocked phrases:</h4>
    ${completion.map((c) => html`<small>${c}</small>`)}
  `;
};

export const Demo = Template.bind({});

Demo.args = {
  minChars: 2,
  completionsCount: 5,
  productsCount: 6,
  categoriesCount: 5,
  cmsCount: 5,
};

Demo.argTypes = {
  minChars: {
    control: { type: 'number' },
    table: { category: 'Options' },
  },
  completionsCount: {
    control: { type: 'number' },
    table: { category: 'Options' },
  },
  productsCount: {
    control: { type: 'number' },
    table: { category: 'Options' },
  },
  categoriesCount: {
    control: { type: 'number' },
    table: { category: 'Options' },
  },
  cmsCount: {
    control: { type: 'number' },
    table: { category: 'Options' },
  },
};
