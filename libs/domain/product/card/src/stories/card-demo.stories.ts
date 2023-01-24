import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductCardComponentOptions } from '../card.model';

export default {
  title: `${storybookPrefix}/Card`,
  args: {
    sku: MockProductService.mockProducts[0].sku,
  },
  argTypes: {
    sku: {
      control: { type: 'select' },
      options: [
        ...MockProductService.mockProducts.map((p) => p.sku),
        'not-found',
      ],
    },
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
  },
} as unknown as Meta;

const Template: Story<ProductCardComponentOptions> = ({
  sku,
  ...options
}: ProductCardComponentOptions): TemplateResult => {
  return html`
    <style>
      product-card {
        max-width: 400px;
      }
    </style>

    <product-card .sku=${sku} .options=${options}></product-card>
  `;
};

export const CardDemo = Template.bind({});
