import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { mockProductProviders, MockProductService } from '../../../src/mocks';
import { ProductAttributesComponentOptions } from '../attributes.model';
import { productAttributesComponent } from '../component';

useComponent(productAttributesComponent);

export default {
  title: `${storybookPrefix}/Attributes`,
  loaders: [setUpMockProviders(mockProductProviders)],
} as unknown as Meta;

type Props = ProductAttributesComponentOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-attributes .sku=${props.sku} .options=${props} />`;
};

export const ProductAttributesDemo = Template.bind({});

ProductAttributesDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  columnCount: '2',
};

ProductAttributesDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [...MockProductService.mockProducts.map((p) => p.sku)],
    table: { category: 'product' },
  },
  columnCount: {
    control: { type: 'select' },
    options: [...[1, 2, 3, 4, 5]],
    table: { category: 'product' },
  },
};
