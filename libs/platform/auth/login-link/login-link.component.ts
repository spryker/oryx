import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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

  protected $isAuthenticated = signal(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    if (!this.$options()?.enableLogout && this.$isAuthenticated()) {
      return;
    }

    return html`
      <oryx-button type="text">
        <button @click=${this.onClick}>
          <oryx-icon .type=${IconTypes.Login}></oryx-icon>
          ${i18n(this.$isAuthenticated() ? 'auth.logout' : 'auth.login')}
        </button>
      </oryx-button>
    `;
  }

  protected onClick(): void {
    if (!this.$isAuthenticated()) {
      this.routerService.navigate('/login');
      return;
    }

    this.authService.logout().subscribe(() => {
      this.routerService.navigate(this.$options()?.logoutRedirectUrl ?? '/');
    });
  }
}

export default LoginLinkComponent;
