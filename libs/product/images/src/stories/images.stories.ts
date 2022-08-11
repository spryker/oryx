import { useComponent } from '@spryker-oryx/core/utilities';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { forceReRender, Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, setupProductMocks } from '../../../src/mocks';
import {
  ProductImagesComponentOptions,
  ProductImagesNavigationAlignment,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout,
  ProductImagesNavigationPosition,
  ProductImagesPreviewLayout,
} from '../images.model';
import { productImagesComponent } from '../index';

useComponent(productImagesComponent);

export default {
  title: `${storybookPrefix}/Images`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductImagesComponentOptions & ProductComponentProperties;

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
  return html`<product-images .sku=${options.sku} .options=${options} />`;
};

export const ImagesDemo = Template.bind({});

ImagesDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  previewLayout: ProductImagesPreviewLayout.CAROUSEL,
  navigationPosition: ProductImagesNavigationPosition.BELOW,
  navigationLayout: ProductImagesNavigationLayout.CAROUSEL,
  navigationDisplay: ProductImagesNavigationDisplay.INLINE,
  navigationAlignment: ProductImagesNavigationAlignment.CENTER,
};

ImagesDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  previewLayout: {
    options: Object.values(ProductImagesPreviewLayout),
    control: { type: 'select' },
    table: { category: 'Preview' },
  },
  navigationPosition: {
    options: Object.values(ProductImagesNavigationPosition),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationLayout: {
    options: Object.values(ProductImagesNavigationLayout),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationDisplay: {
    options: Object.values(ProductImagesNavigationDisplay),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
  navigationAlignment: {
    options: Object.values(ProductImagesNavigationAlignment),
    control: { type: 'select' },
    table: { category: 'Navigation' },
  },
};
