import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, MOCK_PRODUCT_PROVIDERS } from '../../../src/mocks';
import { productCardComponent } from '../component';

useComponent(productCardComponent);

export default {
  title: `${storybookPrefix}/Card`,
  loaders: [setUpMockProviders(MOCK_PRODUCT_PROVIDERS)],
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
