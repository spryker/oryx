import { MockAuthService } from '@spryker-oryx/auth/mocks';
import { resolve } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { take } from 'rxjs';
import { storybookPrefix } from '../../../../.constants';
import { LoginButtonOptions } from '../login-button.model';

export default {
  title: `${storybookPrefix}/Button`,
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

const Template: Story<LoginButtonOptions> = (options): TemplateResult => {
  return html`
    <oryx-button size=${Size.Sm} @click=${toggleLogin}>
      <button style="margin-bottom: 16px" type="submit">
        Toggle auth state
      </button>
    </oryx-button>

    <div @click=${toggleLogin}>
      <oryx-auth-login-button .options=${options}></oryx-auth-login-button>
    </div>
  `;
};

export const Demo = Template.bind({});
