import {
  ProductComponentProperties,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { LoadingStrategy } from '@spryker-oryx/ui/image';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductMediaOptions } from '../media.model';

export default {
  title: `${storybookPrefix}/Media`,
  args: {
    sku: '1',
  },
  argTypes: {
    containerSize: {
      control: { type: 'select' },
      options: [
        ProductMediaContainerSize.Icon,
        ProductMediaContainerSize.Thumbnail,
        ProductMediaContainerSize.Detail,
        ProductMediaContainerSize.Full,
      ],
    },
    alt: {
      control: { type: 'text' },
    },
    loading: {
      control: { type: 'select' },
      options: [LoadingStrategy.Eager, LoadingStrategy.Lazy],
    },
    mediaIndex: {
      control: { type: 'number' },
    },
    sku: {
      control: { type: 'select' },
      options: [
        ...MockProductService.mockProducts.map((p) => p.sku),
        'not-found',
      ],
      table: { category: 'demo' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

type Props = ProductMediaOptions & ProductComponentProperties;

const Template: Story<Props> = (props): TemplateResult => {
  const { sku, ...options } = props;
  return html`
    <oryx-product-media .sku=${sku} .options=${options}></oryx-product-media>

    <style>
      oryx-product-media {
        display: flex;
        width: 300px;
      }
    </style>
  `;
};

export const MediaDemo = Template.bind({});
