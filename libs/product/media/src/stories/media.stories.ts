import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Media`,
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
