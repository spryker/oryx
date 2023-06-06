import { AuthService } from '@spryker-oryx/auth';
import { AppRef, InjectionPlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { RouterService } from '@spryker-oryx/router';
import { asyncState, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { switchMap } from 'rxjs';
import { OfflineDataPlugin } from '../../../offline/data-plugin';
import { userProfileComponentStyles } from './user-profile.styles';

export class UserProfileComponent extends LitElement {
  static styles = userProfileComponentStyles;

  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);
  protected syncSchedulerService = resolve(SyncSchedulerService);

  @asyncState()
  protected currentRoute = valueType(this.routerService.currentRoute());

  @asyncState()
  protected route = valueType(this.routerService.route());

  @asyncState()
  protected pendingSyncs = valueType(this.syncSchedulerService.hasPending());

  protected override render(): TemplateResult {
    const isPicking = this.route?.includes('/picking/');
    const isMainPage = this.route === '/';

    return html`
      <div class="info-block">
        <dl>
          <dt class="info-label">Employee ID</dt>
          <dd class="info-value">admin@spryker.com</dd>
        </dl>
      </div>

      ${when(
        this.pendingSyncs && !isPicking,
        () =>
          html`
            <oryx-notification type="info" scheme="dark">
              You can’t log out because of a pending synchronization.
            </oryx-notification>
          `
      )}
      ${when(
        isPicking,
        () =>
          html`
            <oryx-notification type="info" scheme="dark">
              You can’t log out because picking is in progress.
            </oryx-notification>
          `
      )}

      <oryx-button type="secondary" outline="true">
        <button
          ?disabled="${isPicking || this.pendingSyncs}"
          @click=${this.onLogOut}
        >
          Log Out
        </button>
      </oryx-button>

      ${when(
        isMainPage,
        () =>
          html`
            <oryx-button type="primary">
              <button @click=${this.onReceiveData}>Receive Data</button>
            </oryx-button>
          `
      )}
    `;
  }

  protected onReceiveData(): void {
    const app = resolve(AppRef);
    const injector = app?.requirePlugin(InjectionPlugin).getInjector();
    const injectorDataPlugin = app?.requirePlugin(OfflineDataPlugin);

    injectorDataPlugin
      .clearDb(injector)
      .pipe(switchMap(() => injectorDataPlugin.populateDb(injector)))
      .subscribe(() => {
        this.routerService.navigate('/');
      });
  }

  protected onLogOut(): void {
    this.authService.logout().subscribe(() => {
      this.routerService.navigate('/login');
    });
  }
}
