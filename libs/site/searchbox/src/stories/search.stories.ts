import { setUpMockProviders } from '@spryker-oryx/injector';
import {
  completion,
  MOCK_SEMANTIC_LINK_PROVIDERS,
  MOCK_SUGGESTION_PROVIDERS,
} from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { SiteSearchboxOptions } from '..';
import { storybookPrefix } from '../../../.constants';
import '../index';

export default {
  title: `${storybookPrefix}/Search`,
  loaders: [
    setUpMockProviders(MOCK_SUGGESTION_PROVIDERS, MOCK_SEMANTIC_LINK_PROVIDERS),
  ],
} as unknown as Meta;

const Template: Story<SiteSearchboxOptions> = (
  options: SiteSearchboxOptions
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

    <site-searchbox .options=${options}></site-searchbox>

    <h4>List of mocked phrases:</h4>
    ${completion.map((c) => html`<small>${c}</small>`)}
  `;
};

export const SearchDemo = Template.bind({});

SearchDemo.args = {
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

SearchDemo.argTypes = {
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
