import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { loginComponentStyles } from './login.styles';

export class LoginPageComponent extends LitElement {
  static styles = loginComponentStyles;

  protected override render(): TemplateResult {
    return html`<oryx-image resource="logo"></oryx-image>
      <oryx-heading
        ><h3>
          ${i18n('login.welcome-please-log-in-to-start-picking')}
        </h3></oryx-heading
      >
      <oryx-auth-login
        .options="${{ enableRememberMe: false }}"
      ></oryx-auth-login>`;
  }
}

export default LoginPageComponent;
