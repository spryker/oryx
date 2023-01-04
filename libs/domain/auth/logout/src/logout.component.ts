import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentController,
  RouterService,
} from '@spryker-oryx/experience';
import { asyncValue, hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { finalize, ReplaySubject, switchMap, withLatestFrom } from 'rxjs';
import { LogoutOptions } from './logout.model';

@hydratable('window:load')
export class AuthLogoutComponent extends ComponentMixin<LogoutOptions>() {
  protected routerService = resolve(RouterService);

  protected authService = resolve(AuthService);
  protected options$ = new ContentController(this).getOptions();

  protected logoutTrigger$ = new ReplaySubject<void>(1);

  @subscribe()
  protected logout$ = this.logoutTrigger$.pipe(
    withLatestFrom(this.options$),
    switchMap(([_, options]) => {
      return this.authService.logout().pipe(
        finalize(() => {
          this.routerService.navigate(
            options.customRedirect ? `/${options.customRedirect}` : ''
          );
        })
      );
    })
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.authService.isAuthenticated(), (isAuthenticated) =>
        isAuthenticated
          ? html`
              <oryx-button
                size="small"
                @click=${() => this.logoutTrigger$.next()}
              >
                <button type="submit">Logout</button>
              </oryx-button>
            `
          : html``
      )}
    `;
  }
}
