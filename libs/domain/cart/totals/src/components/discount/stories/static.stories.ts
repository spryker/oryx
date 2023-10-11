import { TotalsContext } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  CartTotalsDiscountOptions,
  DiscountRowsAppearance,
} from '../discount.model';

export default {
  title: `${storybookPrefix}/Cart Totals/components/Discount`,
} as Meta;

const bindContext = (
  context = 'CART',
  id?: string,
  options?: CartTotalsDiscountOptions
) => {
  setTimeout(() => {
    resolve(ContextService).provide(
      document.getElementById(id ?? context)!,
      TotalsContext.Reference,
      context
    );
  }, 0);
  return html`
    <div id=${id ?? context}>
      <oryx-cart-totals-discount
        .options=${options}
      ></oryx-cart-totals-discount>
    </div>
  `;
};

const Template: Story = (): TemplateResult => {
  return html`
    <h3>With single discount</h3>
    ${bindContext('CART-SINGLE-DISCOUNT')}

    <h3>With multiple discounts</h3>
    ${bindContext('CART')}

    <h3>Expanded</h3>
    ${bindContext('CART', 'Expanded', {
      discountRowsAppearance: DiscountRowsAppearance.Expanded,
    })}

    <h3>Collapsed</h3>
    ${bindContext('CART', 'Collapsed', {
      discountRowsAppearance: DiscountRowsAppearance.Collapsed,
    })}

    <h3>Inline</h3>
    ${bindContext('CART', 'Inline', {
      discountRowsAppearance: DiscountRowsAppearance.Inline,
    })}

    <h3>None</h3>
    ${bindContext('CART', 'None', {
      discountRowsAppearance: DiscountRowsAppearance.None,
    })}
  `;
};

export const Variants = Template.bind({});
