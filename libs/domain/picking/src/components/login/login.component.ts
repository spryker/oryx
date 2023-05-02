import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './login.styles';

export class LoginPageComponent extends LitElement {
  static styles = styles;

  protected override render(): TemplateResult {
    return html`<oryx-image resource="logo"></oryx-image>
      <oryx-heading
        ><h3>
          ${i18n('login.welcome-please-log-in-to-start-picking')}
        </h3></oryx-heading
      >
      <oryx-auth-login
        options="${JSON.stringify({ enableRememberMe: false })}"
      ></oryx-auth-login>`;
  }
}

export default LoginPageComponent;
