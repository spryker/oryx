import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Card`,
} as unknown as Meta;

const Template: Story<ProductComponentProperties> = (
  props: ProductComponentProperties
): TemplateResult => {
  return html`<product-card .sku=${props.sku}></product-card>`;
};

export const CardDemo = Template.bind({});

CardDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
};

CardDemo.parameters = {
  chromatic: { disableSnapshot: true },
};

CardDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
  },
};
