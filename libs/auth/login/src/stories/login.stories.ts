import { mockAuthProviders } from '@spryker-oryx/auth';
import { mockCoreProviders } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { mockRouterProviders } from '@spryker-oryx/experience';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { semanticLinkProviders } from '@spryker-oryx/site';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { authLoginComponent } from '../component';
import { LoginOptions } from '../login.model';

useComponent(authLoginComponent);

export default {
  title: `${storybookPrefix}/Login`,
  loaders: [
    setUpMockProviders(
      mockRouterProviders,
      semanticLinkProviders,
      mockCoreProviders,
      mockAuthProviders
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
  return html`<auth-login .options=${options}></auth-login>`;
};

export const Login = Template.bind({});
Login.args = {
  strategy: PasswordVisibilityStrategy.CLICK,
  showRememberMe: true,
  url: '',
};
