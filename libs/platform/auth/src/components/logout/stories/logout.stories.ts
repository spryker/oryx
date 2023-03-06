import { Size } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { LogoutOptions } from '../logout.model';

export default {
  title: `Auth/Logout`,
} as unknown as Meta;

const Template: Story<LogoutOptions> = (props): TemplateResult => {
  const options = {
    redirectUrl: props.redirectUrl,
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
    <oryx-button size=${Size.Sm} @click=${(e: Event) => toggleLogin(e)}>
      <button style="margin-bottom: 16px" type="submit">
        Provide test auth token
      </button>
    </oryx-button>

    <div @click=${pageReload}>
      <oryx-auth-logout .options=${options}></oryx-auth-logout>
    </div>
  `;
};

export const Logout = Template.bind({});
Logout.args = {
  redirectUrl: '',
};
