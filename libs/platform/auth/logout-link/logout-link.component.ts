import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { LogoutLinkOptions } from './logout-link.model';
import { logoutStyles } from './logout-link.styles';

@hydrate({ event: 'window:load' })
export class LogoutLinkComponent extends ContentMixin<LogoutLinkOptions>(
  LitElement
) {
  static styles = logoutStyles;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    if (!this.$isAuthenticated()) return;

    return html`
      <oryx-content-link
        .options=${{ icon: IconTypes.Logout }}
        .content=${{ text: this.i18n('auth.logout') }}
        @click=${this.onClick}
      >
      </oryx-content-link>
    `;
  }

  protected onClick(): void {
    this.authService.logout().subscribe(() => {
      const redirectUrl = this.$options()?.redirectUrl;
      if (redirectUrl) {
        this.routerService.navigate(redirectUrl);
      }
    });
  }
}
