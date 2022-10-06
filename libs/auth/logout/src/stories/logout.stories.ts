import { mockAuthProviders } from '@spryker-oryx/auth';
import { mockCoreProviders } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { mockRouterProviders } from '@spryker-oryx/experience';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { authLogoutComponent } from '../component';
import { LogoutOptions } from '../logout.model';

useComponent(authLogoutComponent);

export default {
  title: `${storybookPrefix}/Logout`,
  loaders: [
    setUpMockProviders(
      mockRouterProviders,
      mockCoreProviders,
      mockAuthProviders
    ),
  ],
} as unknown as Meta;

const Template: Story<LogoutOptions> = (props): TemplateResult => {
  const options = {
    customRedirect: props.customRedirect,
  };

  const pageReload: () => void = () => {
    window.setTimeout(() => {
      window.location.reload();
    });
  };

  const toggleLogin: (e: Event) => void = (e) => {
    window.sessionStorage.setItem(
      'access-token',
      JSON.stringify({
        accessToken: 'test',
        tokenType: 'type',
      })
    );

    pageReload();
  };

  return html`
    <oryx-button size="small" @click=${(e: Event) => toggleLogin(e)}>
      <button style="margin-bottom: 16px" type="submit">
        Provide test auth token
      </button>
    </oryx-button>

    <div @click=${pageReload}>
      <auth-logout .options=${options}></auth-logout>
    </div>
  `;
};

export const Logout = Template.bind({});
Logout.args = {
  customRedirect: '',
};
