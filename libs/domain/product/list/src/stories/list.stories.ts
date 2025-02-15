import '@spryker-oryx/product/card';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductListQualifier,
  SortParamNames,
} from '../../../src/models/product-list-qualifier';

const disabledCategory = 'Not Available in Storybook';

export default {
  title: `${storybookPrefix}/List`,

  args: {
    q: '',
    page: 0,
    maxPrice: 12,
    minPrice: 1,
    minRating: 1,
    ipp: 0,
    brand: '',
    label: '',
    weight: '',
    color: '',
    category: '',
    sort: SortParamNames.None,
  },
  argTypes: {
    sort: {
      control: { type: 'select' },
      options: Object.values(SortParamNames),
      table: {
        category: disabledCategory,
      },
    },
    ipp: {
      control: { type: 'select' },
      options: [12, 24, 36],
    },
    page: {
      table: {
        category: disabledCategory,
      },
    },
    q: {
      table: {
        category: disabledCategory,
      },
    },
    maxPrice: {
      table: {
        category: disabledCategory,
      },
    },
    minPrice: {
      table: {
        category: disabledCategory,
      },
    },
    minRating: {
      table: {
        category: disabledCategory,
      },
    },
    brand: {
      table: {
        category: disabledCategory,
      },
    },
    label: {
      table: {
        category: disabledCategory,
      },
    },
    weight: {
      table: {
        category: disabledCategory,
      },
    },
    color: {
      table: {
        category: disabledCategory,
      },
    },
    category: {
      table: {
        category: disabledCategory,
      },
    },
  },
  parameters: {
    chromatic: { delay: 300 },
  },
} as Meta;

const Template: Story<ProductListQualifier> = (
  props: ProductListQualifier
): TemplateResult => {
  /*
    ToDo: product list doesn't have default layout.
    To show it in a grid view was added 'xs-container xs-layout-grid'.
    Remove them after product list will have default layout
  */

  return html`
    <style>
      product-list {
        --oryx-layout-gap: 10px;
      }
    </style>

    <oryx-product-list
      .options=${props}
      class="xs-container xs-layout-grid"
    ></oryx-product-list>
  `;
};

export const ProductDemo = Template.bind({});

ProductDemo.parameters = {
  chromatic: {
    delay: 3000,
  },
};
