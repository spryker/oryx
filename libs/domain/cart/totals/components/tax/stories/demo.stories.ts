import { TotalsContext } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart Totals/components/Tax`,
} as Meta;

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(
    document.body,
    TotalsContext.Reference,
    'CART'
  );
  return html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`;
};

export const Demo = Template.bind({});
