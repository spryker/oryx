import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, setupProductMocks } from '../../../src/mocks';
import {
  ProductImageComponentOptions,
  ProductImageNavigationDisplay,
  ProductImageNavigationLayout,
  ProductImageNavigationPosition,
  ProductImagePreviewLayout,
} from '../image.model';
import '../index';

export default {
  title: `${storybookPrefix}/Image`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductImageComponentOptions & ProductComponentProperties;

const Template: Story<Props> = (options): TemplateResult => {
  return html`<product-image .sku=${options.sku} .options=${options} />`;
};

export const ProductImageDemo = Template.bind({});

ProductImageDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  previewLayout: ProductImagePreviewLayout.CAROUSEL,
  navigationDisplay: ProductImageNavigationDisplay.BELOW,
  navigationLayout: ProductImageNavigationLayout.CAROUSEL,
  navigationPosition: ProductImageNavigationPosition.INLINE,
};

ProductImageDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  previewLayout: {
    options: Object.values(ProductImagePreviewLayout),
    control: { type: 'select' },
    table: { category: 'Preview' },
  },
  navigationDisplay: {
    options: Object.values(ProductImageNavigationDisplay),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationLayout: {
    options: Object.values(ProductImageNavigationLayout),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationPosition: {
    options: Object.values(ProductImageNavigationPosition),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
};
