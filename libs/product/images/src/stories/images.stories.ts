import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { forceReRender, Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductImagesComponentOptions,
  ProductImagesNavigationAlignment,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout,
  ProductImagesNavigationPosition,
  ProductImagesPreviewLayout,
} from '../images.model';

export default {
  title: `${storybookPrefix}/Images`,
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
