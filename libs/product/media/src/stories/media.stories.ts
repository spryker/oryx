import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, setupProductMocks } from '../../../src/mocks';
import '../index';

export default {
  title: `${storybookPrefix}/Media`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductComponentProperties & {
  size: string;
};

const Template: Story<Props> = (content): TemplateResult => {
  return html`<product-media
    .sku=${content.sku}
    .style=${`
        --image-max-width: ${content.size};
        --image-max-height: ${content.size}
      `}
  />`;
};

export const ProductMediaDemo = Template.bind({});

ProductMediaDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  size: '100%',
};

ProductMediaDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  size: {
    control: { type: 'select' },
    options: ['100%', '32px', '64px', '100px', '300px'],
    table: { category: 'product' },
  },
};
