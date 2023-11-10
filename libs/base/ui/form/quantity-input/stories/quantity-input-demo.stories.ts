import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Quantity input`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props {
  disabled: boolean;
  min: number;
  max: number;
  value: number;
  label: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-quantity-input
      ?disabled=${props.disabled}
      min=${props.min}
      max=${props.max}
      value=${props.value}
      label=${props.label}
      @oryx.update=${({
        detail: { quantity },
      }: {
        detail: { quantity: number };
      }): void => {
        console.log('quantity', quantity);
      }}
    ></oryx-quantity-input>
  `;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: { disableSnapshot: true },
};

Demo.args = {
  disabled: false,
  min: 1,
  max: 10,
  value: 1,
  label: 'Quantity',
};
