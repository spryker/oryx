import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import '@spryker-oryx/product/card';
import { mockProductListProviders } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductListQualifier,
  SortParamNames,
} from '../../../src/models/product-list-qualifier';
import { productListComponent } from '../component';
import '../index';

useComponent(productListComponent);

export default {
  title: `${storybookPrefix}/Product List`,
  loaders: [setUpMockProviders(mockProductListProviders)],
} as unknown as Meta;

const Template: Story<ProductListQualifier> = (
  props: ProductListQualifier
): TemplateResult => {
  return html`
    <style>
      product-list {
        display: flex;
        max-width: 100%;
        overflow: scroll;
      }
    </style>

    <product-list .options=${props}></product-list>
  `;
};

export const ProductDemo = Template.bind({});

ProductDemo.args = {
  q: '',
  page: 0,
  maxPrice: 12,
  minPrice: 1,
  ipp: 0,
  storageCapacity: '',
  brand: '',
  label: '',
  weight: '',
  color: '',
  category: '',
  currency: '',
  sort: SortParamNames.none,
};

ProductDemo.argTypes = {
  sort: {
    control: { type: 'select' },
    options: Object.values(SortParamNames),
  },
};
