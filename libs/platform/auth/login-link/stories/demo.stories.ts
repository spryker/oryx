import { MockAuthService } from '@spryker-oryx/auth/mocks';
import { resolve } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { take } from 'rxjs';
import { storybookPrefix } from '../../../../.constants';
import { LoginLinkOptions } from '../login-link.model';

export default {
  title: `${storybookPrefix}/Login Link`,
  args: {
    enableLogout: true,
  },
} as Meta;

const toggleLogin = () => {
  const service = resolve(MockAuthService);
  service
    .isAuthenticated()
    .pipe(take(1))
    .subscribe((isAuthenticated) => service.setAuthenticated(!isAuthenticated));
};

const Template: Story<LoginLinkOptions> = (options): TemplateResult => {
  return html`
    <oryx-button size=${Size.Sm} @click=${toggleLogin}>
      <button style="margin-bottom: 16px" type="submit">
        Toggle auth state
      </button>
    </oryx-button>

    <div @click=${toggleLogin}>
      <oryx-auth-login-link .options=${options}></oryx-auth-login-link>
    </div>
  `;
};

export const Demo = Template.bind({});
