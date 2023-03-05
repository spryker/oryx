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
import { AuthService } from '../../services/auth.service';
import { LogoutOptions } from './logout.model';
import { styles } from './logout.styles';

@hydratable('window:load')
export class AuthLogoutComponent extends ContentMixin<LogoutOptions>(
  LitElement
) {
  static styles = styles;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  @asyncState()
  protected isAuthenticated = valueType(this.authService.isAuthenticated());

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

  protected logout(): void {
    this.authService
      .logout()
      .subscribe(() =>
        this.routerService.navigate(this.componentOptions?.redirectUrl ?? '/')
      );
  }
}

export default AuthLogoutComponent;
