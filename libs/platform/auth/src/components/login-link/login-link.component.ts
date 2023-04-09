import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { AuthService } from '../../services/auth.service';
import { LoginLinkOptions } from './login-link.model';
import { styles } from './login-link.styles';

@defaultOptions({
  enableLogout: true,
})
@hydratable('window:load')
export class LoginLinkComponent extends ContentMixin<LoginLinkOptions>(
  LitElement
) {
  static styles = styles;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  @asyncState()
  protected isAuthenticated = valueType(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    if (!this.componentOptions?.enableLogout && this.isAuthenticated) {
      return;
    }

    return html`
      <oryx-button type="text">
        <button @click=${this.onClick}>
          <oryx-icon type="login"></oryx-icon>
          ${i18n(this.isAuthenticated ? 'auth.logout' : 'auth.login')}
        </button>
      </oryx-button>
    `;
  }

  protected onClick(): void {
    if (!this.isAuthenticated) {
      this.routerService.navigate('/login');
      return;
    }

    this.authService.logout().subscribe(() => {
      this.routerService.navigate(
        this.componentOptions?.logoutRedirectUrl ?? '/'
      );
    });
  }
}

export default LoginLinkComponent;
