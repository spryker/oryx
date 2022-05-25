import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { ProductImageNavigationDisplay } from '../image.model';
import '../index';
import { setupProductMocks } from './product-mocks';

export default {
  title: `${storybookPrefix}/Image`,
  loaders: [setupProductMocks],
} as Meta;

interface props {
  code: string;
  thumbDisplay: ProductImageNavigationDisplay;
}

const Template: Story<props> = (props): TemplateResult => {
  return html`<product-image
    .code="${props.code}"
    .props=${props}
    .navigationSettings="${{ layout: 'grid', display: 'aside' }}"
  />`;
};

export const ProductImageDemo = Template.bind({});

ProductImageDemo.args = {
  code: '3',
  thumbDisplay: ProductImageNavigationDisplay.BELOW,
};

ProductImageDemo.argTypes = {
  code: {
    control: { type: 'text' },
  },
  thumbDisplay: {
    options: [
      ProductImageNavigationDisplay.BELOW,
      ProductImageNavigationDisplay.ASIDE,
      ProductImageNavigationDisplay.NONE,
    ],
    control: { type: 'select' },
    table: { category: 'Thumbnails' },
  },
};
