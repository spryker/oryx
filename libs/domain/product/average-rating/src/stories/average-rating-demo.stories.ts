import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductAverageRatingOptions } from '../average-rating.model';

export default {
  title: `${storybookPrefix}/Average rating`,
  args: {
    sku: MockProductService.mockProducts[0].sku,
    enableCount: true,
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
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

type Props = ProductAverageRatingOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html`<oryx-product-average-rating
    .sku=${sku}
    .options=${options}
  ></oryx-product-average-rating>`;
};

export const AverageRatingDemo = Template.bind({});
