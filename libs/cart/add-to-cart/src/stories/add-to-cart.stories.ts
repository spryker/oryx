import { setupCartMocks } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { addToCartComponent } from '../add-to-cart.def';
import { AddToCartOptions } from '../add-to-cart.model';

useComponent(addToCartComponent);

export default {
  title: `${storybookPrefix}/Add to cart`,
  loaders: [setupCartMocks()],
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
