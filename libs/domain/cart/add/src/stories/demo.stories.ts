import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartAddOptions } from '../add.model';

export default {
  title: `${storybookPrefix}/Add to cart`,
  args: { hideQuantityInput: false },
} as Meta;

type Props = ProductComponentProperties & CartAddOptions;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-cart-add
      sku="1"
      .options=${{ hideQuantityInput: props.hideQuantityInput }}
    ></oryx-cart-add>
  `;
};

export const Demo = Template.bind({});
