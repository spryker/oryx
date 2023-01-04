import { CheckoutDataService } from '@spryker-oryx/checkout';
import { BehaviorType, toggleBehavior } from '@spryker-oryx/checkout/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

interface Props {
  behavior: BehaviorType;
}

export default {
  title: `${storybookPrefix}/Composition/Static`,
} as unknown as Meta;

const Template: Story<Props> = (props): TemplateResult => {
  const dataService = resolve(CheckoutDataService);
  dataService.setIsGuestCheckout(props.behavior === 'guest');
  toggleBehavior(props.behavior);
  return html`<oryx-checkout-composition></oryx-checkout-composition>`;
};

export const Guest = Template.bind({});
export const Authorized = Template.bind({});

Guest.args = {
  behavior: 'guest',
};

Authorized.args = {
  behavior: 'with-address',
};
