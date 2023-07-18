import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { LoginLinkOptions } from './login-link.model';
import { styles } from './login-link.styles';
import { ButtonType } from '@spryker-oryx/ui/button';

@defaultOptions({
  enableLogout: true,
})
@hydrate({ event: 'window:load' })
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

    const i18nToken = this.$isAuthenticated() ? 'auth.logout' : 'auth.login';

    return html`
      <oryx-button
        .type=${ButtonType.Text}
        .text=${this.i18n(i18nToken)}
        .icon=${IconTypes.Login}
        @click=${this.onClick}
      >
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
