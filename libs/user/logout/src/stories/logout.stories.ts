import { MOCK_AUTH_PROVIDERS } from '@spryker-oryx/core';
import { MOCK_ROUTER_PROVIDERS } from '@spryker-oryx/experience';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { LogoutOptions } from '../logout.model';

export default {
  title: `${storybookPrefix}/Logout`,
  loaders: [setUpMockProviders(MOCK_ROUTER_PROVIDERS, MOCK_AUTH_PROVIDERS)],
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
      <user-logout .options=${options}></user-logout>
    </div>
  `;
};

export const Logout = Template.bind({});
Logout.args = {
  customRedirect: '',
};
