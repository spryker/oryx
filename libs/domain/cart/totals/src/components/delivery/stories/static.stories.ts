import { TotalsContext } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart Totals/components/Delivery`,
} as Meta;

const bindContext = (context = 'CART') => {
  setTimeout(() => {
    resolve(ContextService).provide(
      document.getElementById(context)!,
      TotalsContext.Reference,
      context
    );
  }, 0);
  return html`
    <div id=${context}>
      <oryx-cart-totals-delivery></oryx-cart-totals-delivery>
    </div>
  `;
};

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Without price</h3>
    ${bindContext('CART-NET-MODE')}
    <h3>With price</h3>
    ${bindContext()}
    <h3>Free delivery</h3>
    ${bindContext('CART-SINGLE-DISCOUNT')}
  `;
};

export const Variants = Template.bind({});
