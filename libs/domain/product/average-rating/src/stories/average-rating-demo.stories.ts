import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductAverageRatingModel } from '../average-rating.model';

export default {
  title: `${storybookPrefix}/Average rating`,
} as unknown as Meta;

type Props = ProductAverageRatingModel & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-average-rating .sku=${props.sku} .options=${props} />`;
};

export const AverageRatingDemo = Template.bind({});

AverageRatingDemo.args = {
  sku: MockProductService.mockProducts[0].sku,
  hideReviewCount: false,
};

AverageRatingDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  hideReviewCount: {
    table: { category: 'component' },
  },
};
