import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductAttributesComponentOptions } from '../attributes.model';

export default {
  title: `${storybookPrefix}/Attributes`,
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
