import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { forceReRender, Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductImagesComponentOptions,
  ProductImagesMainLayout,
  ProductImagesNavigationAlignment,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout,
  ProductImagesNavigationMouseEvent,
  ProductImagesNavigationPosition,
} from '../images.model';

export default {
  title: `${storybookPrefix}/Images`,
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
      table: { category: 'product' },
    },
    previewLayout: {
      options: [
        ProductImagesMainLayout.Carousel,
        ProductImagesMainLayout.Toggle,
        ProductImagesMainLayout.None,
      ],
      control: { type: 'select' },
      table: { category: 'Preview' },
    },
    mainImageWidth: {
      control: { type: 'text' },
      table: { category: 'Preview' },
    },
    mainImageHeight: {
      control: { type: 'text' },
      table: { category: 'Preview' },
    },
    navigationDisplay: {
      options: [
        ProductImagesNavigationDisplay.Inline,
        ProductImagesNavigationDisplay.Floating,
        ProductImagesNavigationDisplay.None,
      ],
      control: { type: 'select' },
      table: { category: 'Navigation' },
    },
    navigationLayout: {
      options: [
        ProductImagesNavigationLayout.Carousel,
        ProductImagesNavigationLayout.Grid,
      ],
      control: { type: 'select' },
      table: { category: 'Navigation' },
    },
    navigationPosition: {
      options: [
        ProductImagesNavigationPosition.Top,
        ProductImagesNavigationPosition.Bottom,
        ProductImagesNavigationPosition.Start,
        ProductImagesNavigationPosition.End,
      ],
      control: { type: 'select' },
      table: { category: 'Navigation' },
    },
    navigationAlignment: {
      options: [
        ProductImagesNavigationAlignment.Start,
        ProductImagesNavigationAlignment.Center,
        ProductImagesNavigationAlignment.End,
      ],
      control: { type: 'select' },
      table: { category: 'Navigation' },
    },
    navigationMouseEvent: {
      options: [
        ProductImagesNavigationMouseEvent.Click,
        ProductImagesNavigationMouseEvent.Mouseover,
      ],
      control: { type: 'select' },
      table: { category: 'Navigation' },
    },
    thumbWidth: {
      control: { type: 'text' },
      table: { category: 'Navigation' },
    },
    thumbHeight: {
      control: { type: 'text' },
      table: { category: 'Navigation' },
    },
    gridItemsPerColumn: {
      control: { type: 'number' },
      table: { category: 'Navigation' },
    },
  },
} as unknown as Meta;

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

const Template: Story<
  ProductImagesComponentOptions & ProductComponentProperties
> = (options): TemplateResult => {
  return html`<oryx-product-images .sku=${options.sku} .options=${options} />`;
};

export const ImagesDemo = Template.bind({});
