import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { take, tap } from 'rxjs';
import { LogoutOptions } from './logout.model';
import { styles } from './logout.styles';

@hydratable('window:load')
export class AuthLogoutComponent extends ContentMixin<LogoutOptions>(
  LitElement
) {
  static styles = styles;

  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);

  @asyncState()
  protected isAuthenticated = valueType(this.authService.isAuthenticated());

  protected logout(): void {
    this.authService
      .logout()
      .pipe(
        take(1),
        tap(() => this.redirect())
      )
      .subscribe();
  }

  protected redirect(): void {
    this.routerService.navigate(
      this.options?.redirectUrl ? `/${this.options.redirectUrl}` : '/'
    );
  }

  protected override render(): TemplateResult | void {
    if (!this.isAuthenticated) {
      return;
    }

    return html`
      <oryx-button type="text">
        <button @click=${this.logout}>
          <oryx-icon type="login"></oryx-icon>
          ${i18n('auth.logout')}
        </button>
      </oryx-button>
    `;
  }
}
