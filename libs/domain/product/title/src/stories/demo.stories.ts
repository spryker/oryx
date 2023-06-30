import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { ProductTitleOptions } from '@spryker-oryx/product/title';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle', 'caption'];

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
      options: tags,
      control: { type: 'select' },
    },
    as: {
      options: [...tags, 'hide', 'show'],
      control: { type: 'select' },
    },
    asLg: {
      options: [...tags, 'hide', 'show'],
      control: { type: 'select' },
    },
    asMd: {
      options: [...tags, 'hide', 'show'],
      control: { type: 'select' },
    },
    asSm: {
      options: [...tags, 'hide', 'show'],
      control: { type: 'select' },
    },
    maxLines: {
      control: { type: 'number' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
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
