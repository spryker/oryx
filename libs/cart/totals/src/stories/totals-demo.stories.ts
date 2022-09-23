import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { setupCartMocks } from '../../../src/mocks';
import { cartTotalsComponent } from '../totals.def';

useComponent(cartTotalsComponent);

export default {
  title: `${storybookPrefix}/Cart totals`,
  loaders: [setupCartMocks()],
  argTypes: {
    deliveryMessage: { control: { type: 'text' } },
  },
} as unknown as Meta;

interface Props {
  showTax: boolean;
  showTaxMessage: boolean;
  showDiscounts: boolean;
  deliveryMessage: string;
}

const Template: Story<Props> = (options: Props): TemplateResult => {
  return html`<cart-totals .options=${options}></cart-totals>`;
};

export const cartTotalsDemo = Template.bind({});

cartTotalsDemo.args = {
  showTax: true,
  showTaxMessage: true,
  showDiscounts: true,
};
