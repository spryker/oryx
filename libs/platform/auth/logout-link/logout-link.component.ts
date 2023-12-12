import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { LogoutLinkOptions } from './logout-link.model';

@hydrate({ event: 'window:load' })
export class LogoutLinkComponent extends ContentMixin<LogoutLinkOptions>(
  LitElement
) {
  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    if (!this.$isAuthenticated()) return;

    const icon = this.$options()?.icon;
    return html`
      <oryx-content-link
        .options=${{ icon }}
        .content=${{ text: this.i18n('auth.logout') }}
        @click=${this.onClick}
      >
      </oryx-content-link>
    `;
  }

  protected onClick(): void {
    this.authService.logout().subscribe(() => {
      const { redirectUrl } = this.$options();
      if (redirectUrl) {
        this.routerService.navigate(redirectUrl);
      }
    });
  }
}
