import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { setupCartMocks } from '../../../src/mocks/cart.mock';
import { AddToCartOptions } from '../add-to-cart.model';
import '../index';

export default {
  title: `${storybookPrefix}/Add to cart`,
  loaders: [setupCartMocks],
} as unknown as Meta;

type Props = ProductComponentProperties & AddToCartOptions;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <add-to-cart
      sku="1"
      .options=${{
        hideQuantityInput: props.hideQuantityInput,
        disabled: props.disabled,
      }}
    ></add-to-cart>
  `;
};

export const Demo = Template.bind({});

Demo.args = {
  hideQuantityInput: false,
  disabled: false,
};
