import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { mockProductProviders, MockProductService } from '../../../src/mocks';
import { productMediaComponent } from '../component';

useComponent(productMediaComponent);

export default {
  title: `${storybookPrefix}/Media`,
  loaders: [setUpMockProviders(mockProductProviders)],
} as unknown as Meta;

type Props = ProductComponentProperties & {
  size: string;
};

const Template: Story<Props> = (content): TemplateResult => {
  return html` <style>
      product-media {
        display: block;
        width: ${content.size};
        height: ${content.size};
      }
    </style>

    <product-media .sku=${content.sku} />`;
};

export const MediaDemo = Template.bind({});

MediaDemo.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};

MediaDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  size: '300px',
};

MediaDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  size: {
    control: { type: 'select' },
    options: ['32px', '64px', '100px', '300px'],
    table: { category: 'product' },
  },
};
