import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { ProductTitleOptions } from '@spryker-oryx/product/title';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Title`,
  args: {
    sku: MockProductService.mockProducts[0].sku,
    tag: '',
    link: false,
  },
  argTypes: {
    sku: {
      control: { type: 'select' },
      options: [
        ...MockProductService.mockProducts.map((p) => p.sku),
        'not-found',
      ],
      table: { category: 'demo' },
    },
    tag: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle'],
      control: { type: 'select' },
    },
    maxLines: {
      control: { type: 'number' },
    },
  },
} as Meta;

type Props = ProductTitleOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html`
    <oryx-product-title .sku=${sku} .options=${options}></oryx-product-title>
  `;
};

export const TitleDemo = Template.bind({});
