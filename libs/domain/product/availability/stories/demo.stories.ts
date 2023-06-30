import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CartItemAvailabilityOptions } from '../availability.model';

export default {
  title: `${storybookPrefix}/Availability`,
  args: {
    sku: '1',
    threshold: 5,
    enableIndicator: true,
    enableExactStock: true,
  },
  argTypes: {
    sku: {
      control: { type: 'select' },
      options: [...MockProductService.mockProducts.map((p) => p.sku)],
      table: { category: 'demo' },
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

type Props = CartItemAvailabilityOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html`<oryx-product-availability
    sku=${sku}
    .options=${options}
  ></oryx-product-availability>`;
};

export const Demo = Template.bind({});
