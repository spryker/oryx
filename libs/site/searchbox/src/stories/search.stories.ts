import { setUpMockProviders } from '@spryker-oryx/injector';
import { MOCK_SUGGESTION_PROVIDERS } from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { SiteSearchboxOptions } from '..';
import { storybookPrefix } from '../../../.constants';
import '../index';

export default {
  title: `${storybookPrefix}/Search`,
  loaders: [setUpMockProviders(MOCK_SUGGESTION_PROVIDERS)],
} as unknown as Meta;

const Template: Story<SiteSearchboxOptions> = (
  options: SiteSearchboxOptions
): TemplateResult => {
  return html`<site-searchbox .options=${options} />`;
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
