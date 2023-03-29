import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { DiscountRowsAppearance } from '../discount.model';

export default {
  title: `${storybookPrefix}/Cart totals/components/discount`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>With value</h3>
    <oryx-cart-totals-discount
      cartId="discount-multi-rows"
    ></oryx-cart-totals-discount>
    <h3>Empty cart</h3>
    <oryx-cart-totals-discount cartId="empty"></oryx-cart-totals-discount>
    <h3>Multi discounts</h3>
    <oryx-cart-totals-discount
      cartId="discount-multi-rows"
    ></oryx-cart-totals-discount>
    <h3>Inline</h3>
    <oryx-cart-totals-discount
      cartId="discount-multi-rows"
      .options=${{ discountRowsAppearance: DiscountRowsAppearance.Inline }}
    ></oryx-cart-totals-discount>
    <h3>Expanded</h3>
    <oryx-cart-totals-discount
      cartId="discount-multi-rows"
      .options=${{ discountRowsAppearance: DiscountRowsAppearance.Expanded }}
    ></oryx-cart-totals-discount>
    <h3>Collapsed</h3>
    <oryx-cart-totals-discount
      cartId="discount-multi-rows"
      .options=${{ discountRowsAppearance: DiscountRowsAppearance.Collapsed }}
    ></oryx-cart-totals-discount>
    <h3>None</h3>
    <oryx-cart-totals-discount
      cartId="discount-multi-rows"
      .options=${{ discountRowsAppearance: DiscountRowsAppearance.None }}
    ></oryx-cart-totals-discount>
  `;
};

export const variations = Template.bind({});
