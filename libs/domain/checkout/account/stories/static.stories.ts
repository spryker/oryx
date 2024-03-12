import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../.constants';
import { CheckoutAccountComponentOptions } from '../account.model';

export default {
  title: `${storybookPrefix}/Account/Static`,
} as Meta;

const Template: Story<CheckoutAccountComponentOptions> = (
  props: CheckoutAccountComponentOptions
): TemplateResult => {
  return html`
    <oryx-checkout-account .options=${props}></oryx-checkout-account>
    ${when(
      !props.enableGuestCheckout,
      () => html`(empty when guest checkout is not enabled)`
    )}
  `;
};

export const GuestEnabled = Template.bind({});
GuestEnabled.args = { enableGuestCheckout: true };

export const GuestDisabled = Template.bind({});
GuestDisabled.args = { enableGuestCheckout: false };
