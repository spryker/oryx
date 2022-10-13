import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductCardComponentOptions } from '../card.model';

export default {
  title: `${storybookPrefix}/Card`,
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

CardDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  truncateTitleAfter: 1,
  hideTitle: false,
  hidePrice: false,
  hideRating: false,
  hideLabels: false,
  hideFavorites: false,
};

CardDemo.parameters = {
  chromatic: { disableSnapshot: true },
};

CardDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
  },
};
