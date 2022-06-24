import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { AddToCartModel } from '../add-to-cart.model';
import '../index';

export default {
  title: `${storybookPrefix}`,
} as Meta;

type Props = ProductComponentProperties & AddToCartModel;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <add-to-cart
      .sku=${props.sku}
      .content=${{
        hideQuantityInput: props.hideQuantityInput,
        loading: props.loading,
      }}
    ></add-to-cart>
  `;
};

export const AddToCart = Template.bind({});

AddToCart.args = {
  sku: '1',
  hideQuantityInput: false,
  loading: false,
};

AddToCart.argTypes = {
  sku: {
    control: { type: 'select' },
    options: ['1', '2', '3', 'not-found'],
  },
};
