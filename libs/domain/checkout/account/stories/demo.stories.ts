import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../.constants';
import { CheckoutAccountComponentOptions } from '../account.model';

export default {
  title: `${storybookPrefix}/Account`,
  args: {
    enableGuestCheckout: true,
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<CheckoutAccountComponentOptions> = (
  props: CheckoutAccountComponentOptions
): TemplateResult => {
  return html`<oryx-checkout-account .options=${props}></oryx-checkout-account>
    ${when(
      !props.enableGuestCheckout,
      () => html`(empty when guest checkout is not enabled)`
    )} `;
};

export const Demo = Template.bind({});
