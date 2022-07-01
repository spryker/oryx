import { ProductComponentProperties } from '@spryker-oryx/product';
import { forceReRender, Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, setupProductMocks } from '../../../src/mocks';
import {
  ProductImageComponentOptions,
  ProductImageNavigationAlignment,
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

const el = document.querySelector('html');
let oldVal = el?.getAttribute('dir');

const observer = new MutationObserver(([mutation]) => {
  const newVal = el?.getAttribute(mutation.attributeName as string);
  if (oldVal !== newVal) {
    oldVal = newVal;
    forceReRender();
  }
});

observer.observe(el as HTMLHtmlElement, {
  attributes: true,
  attributeFilter: ['dir'],
});

const Template: Story<Props> = (options): TemplateResult => {
  return html`<product-image .sku=${options.sku} .options=${options} />`;
};

export const ProductImageDemo = Template.bind({});

ProductImageDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  previewLayout: ProductImagePreviewLayout.CAROUSEL,
  navigationPosition: ProductImageNavigationPosition.BELOW,
  navigationLayout: ProductImageNavigationLayout.CAROUSEL,
  navigationDisplay: ProductImageNavigationDisplay.INLINE,
  navigationAlignment: ProductImageNavigationAlignment.CENTER,
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
  navigationPosition: {
    options: Object.values(ProductImageNavigationPosition),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationLayout: {
    options: Object.values(ProductImageNavigationLayout),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationDisplay: {
    options: Object.values(ProductImageNavigationDisplay),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationAlignment: {
    options: Object.values(ProductImageNavigationAlignment),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
};
