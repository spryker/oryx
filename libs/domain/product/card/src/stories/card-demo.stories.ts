import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductCardOptions } from '../card.model';

export default {
  title: `${storybookPrefix}/Card`,
  args: {
    sku: MockProductService.mockProducts[0].sku,
  },
  argTypes: {
    enableTitle: {
      control: { type: 'boolean' },
    },
    titleLineClamp: {
      control: { type: 'number' },
    },
    enablePrice: {
      control: { type: 'boolean' },
    },
    enableRating: {
      control: { type: 'boolean' },
    },
    enableLabels: {
      control: { type: 'boolean' },
    },
    enableWishlist: {
      control: { type: 'boolean' },
    },
    sku: {
      control: { type: 'select' },
      options: [
        ...MockProductService.mockProducts.map((p) => p.sku),
        'not-found',
      ],
      table: { category: 'demo' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<ProductCardOptions> = (
  props: ProductCardOptions
): TemplateResult => {
  const { sku, ...options } = props;
  return html`
    <style>
      oryx-product-card {
        max-width: 400px;
      }
    </style>

    <oryx-product-card .sku=${sku} .options=${options}></oryx-product-card>
  `;
};

export const CardDemo = Template.bind({});

CardDemo.parameters = {
  chromatic: {
    delay: 3000,
  },
};
