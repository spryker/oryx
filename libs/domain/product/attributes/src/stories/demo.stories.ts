import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductAttributesOptions } from '../attributes.model';

export default {
  title: `${storybookPrefix}/Attributes`,
  args: {
    columnCount: 2,
    sku: MockProductService.mockProducts[0].sku,
  },
  argTypes: {
    columnCount: {
      control: { type: 'select' },
      options: [...[1, 2, 3, 4, 5]],
    },
    sku: {
      control: { type: 'select' },
      options: [...MockProductService.mockProducts.map((p) => p.sku)],
      table: { category: 'demo' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

type Props = ProductAttributesOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html`<oryx-product-attributes
    .sku=${sku}
    .options=${options}
  ></oryx-product-attributes>`;
};

export const Demo = Template.bind({});
