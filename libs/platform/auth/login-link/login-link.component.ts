import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { featureVersion, hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { LoginLinkOptions } from './login-link.model';
import { styles } from './login-link.styles';

const isLatest = featureVersion <= '1.1';

@defaultOptions({
  enableLogout: true,
})
@hydrate({ event: 'window:load' })
export class LoginLinkComponent extends ContentMixin<LoginLinkOptions>(
  LitElement
) {
  static styles = isLatest ? styles : undefined;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    if (!this.$options()?.enableLogout && this.$isAuthenticated()) {
      return;
    }

    const i18nToken = this.$isAuthenticated() ? 'auth.logout' : 'auth.login';

    return isLatest
      ? html`
          <oryx-dropdown-item
            .options=${{ icon: IconTypes.Login }}
            .content=${{ text: this.i18n(i18nToken) }}
            @click=${this.onClick}
          >
          </oryx-dropdown-item>
        `
      : html`<oryx-button
          .type=${ButtonType.Text}
          .text=${this.i18n(i18nToken)}
          .icon="${IconTypes.Login}"
          @click=${this.onClick}
        ></oryx-button>`;
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
