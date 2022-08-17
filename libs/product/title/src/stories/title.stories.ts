import { useComponent } from '@spryker-oryx/core/utilities';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService } from '../../../src/mocks';
import { setupProductMocks } from '../../../src/mocks/product.mock';
import { productTitleComponent } from '../component';
import { ProductTitleOptions } from '../model';

useComponent(productTitleComponent);

export default {
  title: `${storybookPrefix}/Title`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductTitleOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-title .sku=${props.sku} .options=${props} />`;
};

export const TitleDemo = Template.bind({});

TitleDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  tag: '',
  singleLine: false,
};

TitleDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  tag: {
    options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    control: { type: 'select' },
    table: { category: 'component' },
  },
  singleLine: {
    table: { category: 'component' },
  },
};
