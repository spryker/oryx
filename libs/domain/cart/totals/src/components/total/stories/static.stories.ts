import { TotalsContext } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { CartTotalsTotalOptions } from '../total.model';

export default {
  title: `${storybookPrefix}/Cart Totals/components/Total`,
} as Meta;

const bindContext = (
  context = 'CART',
  id?: string,
  options?: CartTotalsTotalOptions
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
      <oryx-cart-totals-total .options=${options}></oryx-cart-totals-total>
    </div>
  `;
};

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Tax included</h3>
    ${bindContext()}
    <h3>Tax excluded</h3>
    ${bindContext('CART-NET-MODE')}
    <h3>Without tax message</h3>
    ${bindContext('CART', 'EMPTY-MESSAGE', { enableTaxMessage: false })}
  `;
};

export const Variants = Template.bind({});
