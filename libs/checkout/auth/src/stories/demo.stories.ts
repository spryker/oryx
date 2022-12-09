import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CheckoutAuthOptions } from '../auth.model';

export default {
  title: `${storybookPrefix}/Auth`,
  argTypes: {
    guestUrl: {
      type: 'string',
    },
    loginUrl: {
      type: 'string',
    },
    disableGuest: {
      type: 'boolean',
    },
  },
} as unknown as Meta;

const Template: Story<CheckoutAuthOptions> = (props): TemplateResult => {
  return html`
    <style>
      checkout-auth {
        --oryx-layout-gap: 30px;
        align-items: stretch;
      }
    </style>
    <checkout-auth .options=${props}></checkout-auth>
  `;
};

export const AuthDemo = Template.bind({});

AuthDemo.args = {
  disableGuest: false,
};

AuthDemo.parameters = {
  chromatic: {
    delay: 300,
  },
};
