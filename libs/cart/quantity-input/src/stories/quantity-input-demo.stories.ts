import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { quantityInputComponent } from '../index';

useComponent(quantityInputComponent);

export default {
  title: `${storybookPrefix}/Quantity input`,
} as Meta;

interface Props {
  disabled: boolean;
  min: number;
  max: number;
  value: number;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <quantity-input
      ?disabled=${props.disabled}
      min=${props.min}
      max=${props.max}
      value=${props.value}
      @update=${({
        detail: { quantity },
      }: {
        detail: { quantity: number };
      }): void => {
        console.log('quantity', quantity);
      }}
    ></quantity-input>
  `;
};

export const Demo = Template.bind({});

Demo.args = {
  disabled: false,
  min: 1,
  max: 10,
  value: 1,
};
