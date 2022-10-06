import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { AddToCartOptions } from '../add-to-cart.model';

export default {
  title: `${storybookPrefix}/Add to cart`,
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
