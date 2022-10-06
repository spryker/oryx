import '@spryker-oryx/product/card';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductListQualifier,
  SortParamNames,
} from '../../../src/models/product-list-qualifier';

export default {
  title: `${storybookPrefix}/Product List`,
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
  minRating: 1,
  ipp: 0,
  storageCapacity: '',
  brand: '',
  label: '',
  weight: '',
  color: '',
  category: '',
  currency: '',
  sort: SortParamNames.None,
};

ProductDemo.argTypes = {
  sort: {
    control: { type: 'select' },
    options: Object.values(SortParamNames),
  },
};
