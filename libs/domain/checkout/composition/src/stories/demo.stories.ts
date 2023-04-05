import { CheckoutDataService } from '@spryker-oryx/checkout';
import { BehaviorType, toggleBehavior } from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Composition`,
  argTypes: {
    behavior: {
      options: ['guest', 'with-address'] as BehaviorType[],
      control: { type: 'select' },
      table: { category: 'Filtering' },
    },
  },
} as unknown as Meta;

interface Props {
  behavior: BehaviorType;
}

const Template: Story<Props> = (props): TemplateResult => {
  toggleBehavior(props.behavior);
  resolve(CheckoutDataService).setGuestCheckout(props.behavior === 'guest');
  return html`<oryx-checkout-composition></oryx-checkout-composition>`;
};

export const Demo = Template.bind({});

Demo.args = {
  behavior: 'guest',
};
