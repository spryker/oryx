import {
  ProductComponentProperties,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { LoadingStrategy } from '@spryker-oryx/ui/image';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductMediaOptions } from '../media.model';

export default {
  title: `${storybookPrefix}/Media`,
  args: {},
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
  },
} as Meta;

type Props = ProductMediaOptions & ProductComponentProperties;

const Template: Story<Props> = (props): TemplateResult => {
  return html`
    <product-media sku="1" .options=${props}></product-media>

    <style>
      product-media {
        display: flex;
        width: 300px;
      }
    </style>
  `;
};

export const MediaDemo = Template.bind({});

MediaDemo.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};
