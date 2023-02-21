import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import {
  asyncState,
  hydratable,
  subscribe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { finalize, ReplaySubject, switchMap, withLatestFrom } from 'rxjs';
import { LogoutOptions } from './logout.model';
import { styles } from './logout.styles';

@hydratable('window:load')
export class AuthLogoutComponent extends ContentMixin<LogoutOptions>(
  LitElement
) {
  static styles = styles;

  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);

  protected logoutTrigger$ = new ReplaySubject<void>(1);

  @asyncState()
  protected isAuthenticated = valueType(this.authService.isAuthenticated());

  @subscribe()
  protected logout$ = this.logoutTrigger$.pipe(
    withLatestFrom(this.options$),
    switchMap(([_, options]) =>
      this.authService.logout().pipe(
        finalize(() => {
          this.routerService.navigate(
            options.customRedirect ? `/${options.customRedirect}` : ''
          );
        })
      )
    )
  );

  protected override render(): TemplateResult | void {
    if (!this.isAuthenticated) {
      return;
    }

    return html`
      <oryx-button type="text">
        <button @click=${() => this.logoutTrigger$.next()}>
          <oryx-icon type="login"></oryx-icon>
          Logout
        </button>
      </oryx-button>
    `;
  }
}
