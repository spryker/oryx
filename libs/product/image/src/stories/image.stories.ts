import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import {
  ProductImageComponentProperties,
  ProductImageNavigationDisplay,
  ProductImageNavigationLayout,
  ProductImageNavigationPosition,
  ProductImagePreviewLayout,
} from '../image.model';
import '../index';
import { setupProductMocks } from './product-mocks';

export default {
  title: `${storybookPrefix}/Image`,
  loaders: [setupProductMocks],
} as Meta;

const Template: Story<ProductImageComponentProperties> = (
  props
): TemplateResult => {
  return html`<product-image .code="${props.code}" .props=${props} />`;
};

export const ProductImageDemo = Template.bind({});

ProductImageDemo.args = {
  code: '1',
  previewLayout: ProductImagePreviewLayout.CAROUSEL,
  navigationDisplay: ProductImageNavigationDisplay.BELOW,
  navigationLayout: ProductImageNavigationLayout.CAROUSEL,
  navigationPosition: ProductImageNavigationPosition.INLINE,
};

ProductImageDemo.argTypes = {
  code: {
    options: ['1', '2', '3'],
    control: { type: 'select' },
    table: { category: 'Product' },
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
