import { Size } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { AuthButtonOptions } from '../button.model';

export default {
  title: `${storybookPrefix}/Button`,
} as Meta;

const Template: Story<AuthButtonOptions> = (options): TemplateResult => {
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
      <oryx-auth-button .options=${options}></oryx-auth-button>
    </div>
  `;
};

export const Demo = Template.bind({});
