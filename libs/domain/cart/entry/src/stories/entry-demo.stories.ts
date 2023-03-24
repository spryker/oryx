import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartEntryAttributes } from '../entry.model';

export default {
  title: `${storybookPrefix}/Entry`,
  args: {
    sku: MockProductService.mockProducts[0].sku,
    quantity: 1,
    readonly: false,
  } as CartEntryAttributes,
  argTypes: {
    sku: {
      control: { type: 'select' },
      options: MockProductService.mockProducts.map((p) => p.sku),
      table: { category: 'demo' },
    },
  },
} as unknown as Meta;

const Template: Story<CartEntryAttributes> = (
  props: CartEntryAttributes
): TemplateResult => {
  return html`
    <oryx-cart-entry
      .sku=${props.sku}
      .quantity=${props.quantity}
      price="99"
      .readonly=${props.readonly}
    ></oryx-cart-entry>
  `;
};

export const Demo = Template.bind({});
