import { MOCK_AUTH_PROVIDERS } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { MOCK_ROUTER_PROVIDERS } from '@spryker-oryx/experience';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { SEMANTIC_LINK_PROVIDERS } from '@spryker-oryx/site';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { userLoginComponent } from '../component';
import { LoginOptions } from '../login.model';

useComponent(userLoginComponent);

export default {
  title: `${storybookPrefix}/Login`,
  loaders: [
    setUpMockProviders(
      MOCK_ROUTER_PROVIDERS,
      SEMANTIC_LINK_PROVIDERS,
      MOCK_AUTH_PROVIDERS
    ),
  ],
  argTypes: {
    strategy: {
      options: [
        PasswordVisibilityStrategy.CLICK,
        PasswordVisibilityStrategy.MOUSEDOWN,
        PasswordVisibilityStrategy.HOVER,
        PasswordVisibilityStrategy.NONE,
      ],
      control: { type: 'radio' },
      description: 'Password field visibility strategy.',
    },
    showRememberMe: {
      type: 'boolean',
    },
    url: {
      type: 'string',
    },
  },
} as unknown as Meta;

const Template: Story<LoginOptions> = (props): TemplateResult => {
  const options = {
    strategy: props.strategy,
    showRememberMe: props.showRememberMe,
    url: props.url,
  };
  return html`<user-login .options=${options}></user-login>`;
};

export const Login = Template.bind({});
Login.args = {
  strategy: PasswordVisibilityStrategy.CLICK,
  showRememberMe: true,
  url: '',
};
