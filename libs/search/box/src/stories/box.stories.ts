import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { completion, MOCK_SUGGESTION_PROVIDERS } from '@spryker-oryx/search';
import { SEMANTIC_LINK_PROVIDERS } from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { searchBoxComponent, SearchBoxOptions } from '../index';

useComponent(searchBoxComponent);

export default {
  title: `${storybookPrefix}/SearchBox`,
  loaders: [
    setUpMockProviders(MOCK_SUGGESTION_PROVIDERS, SEMANTIC_LINK_PROVIDERS),
  ],
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

    <search-box .options=${options}></search-box>

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
  placeholder: '',
  clearButtonTitle: '',
  closeButtonArialLabel: '',
  nothingFoundText: '',
  completionTitle: '',
  categoriesTitle: '',
  cmsTitle: '',
  productsTitle: '',
  viewAllProductsButtonTitle: '',
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
  placeholder: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  clearButtonTitle: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  closeButtonArialLabel: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  nothingFoundText: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  completionTitle: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  categoriesTitle: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  cmsTitle: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  productsTitle: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
  viewAllProductsButtonTitle: {
    control: { type: 'text' },
    table: { category: 'Texts' },
  },
};
