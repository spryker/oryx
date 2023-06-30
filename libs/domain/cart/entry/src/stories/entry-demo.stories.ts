import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartEntryAttributes, CartEntryOptions } from '../entry.model';

export default {
  title: `${storybookPrefix}/Entry`,
  args: {
    sku: MockProductService.mockProducts[0].sku,
    quantity: 1,
    readonly: false,
    enableItemId: true,
    enableItemImage: true,
    enableItemPrice: true,
    notifyOnUpdate: false,
    confirmBeforeRemove: false,
    notifyOnRemove: false,
    price: 3000,
  } as CartEntryAttributes & CartEntryOptions,
  argTypes: {
    sku: {
      control: { type: 'select' },
      options: MockProductService.mockProducts.map((p) => p.sku),
      table: { category: 'demo' },
    },
    price: { table: { category: 'demo' } },
    quantity: { table: { category: 'demo' } },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as unknown as Meta;

const Template: Story<CartEntryAttributes & CartEntryOptions> = (
  props: CartEntryAttributes
): TemplateResult => {
  return html`
    <oryx-cart-entry
      .sku=${props.sku}
      .quantity=${props.quantity}
      .price=${props.price}
      .readonly=${props.readonly}
      .options=${props}
    ></oryx-cart-entry>
  `;
};

export const Demo = Template.bind({});
