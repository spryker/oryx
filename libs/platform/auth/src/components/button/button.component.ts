import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { AuthService } from '../../services/auth.service';
import { AuthButtonOptions } from './button.model';
import { styles } from './button.styles';

@hydratable('window:load')
export class AuthButtonComponent extends ContentMixin<AuthButtonOptions>(
  LitElement
) {
  static styles = styles;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  @asyncState()
  protected loginUrl = valueType(
    resolve(SemanticLinkService).get({ type: SemanticLinkType.Login })
  );

  @asyncState()
  protected isAuthenticated = valueType(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
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
      this.routerService.navigate(this.loginUrl!);
      return;
    }

    this.authService.logout().subscribe(() => {
      this.routerService.navigate(
        this.componentOptions?.logoutRedirectUrl ?? '/'
      );
    });
  }
}

export default AuthButtonComponent;
