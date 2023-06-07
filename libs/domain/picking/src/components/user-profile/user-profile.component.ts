import { AuthService } from '@spryker-oryx/auth';
import { AppRef } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { RouterService } from '@spryker-oryx/router';
import { CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { delay, tap } from 'rxjs';
import { OfflineDataPlugin } from '../../../offline/data-plugin';
import { userProfileComponentStyles } from './user-profile.styles';

signalAware();
export class UserProfileComponent extends LitElement {
  static styles = userProfileComponentStyles;

  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);
  protected syncSchedulerService = resolve(SyncSchedulerService);

  protected injector = resolve(INJECTOR);
  protected injectorDataPlugin =
    resolve(AppRef).requirePlugin(OfflineDataPlugin);

  @state()
  protected loading: boolean | null = null;

  protected route = signal(this.routerService.route());
  protected pendingSyncs = signal(
    this.syncSchedulerService.hasPending().subscribe()
  );

  protected override render(): TemplateResult {
    const isPicking = this.route()?.includes('/picking/');
    const isMainPage = this.route() === '/';

    return html`
      <div class="info-block">
        <dl>
          <dt class="info-label">${i18n('user.profile.employee-id')}</dt>
          <dd class="info-value">admin@spryker.com</dd>
        </dl>
      </div>

      ${when(
        this.pendingSyncs() && !isPicking,
        () =>
          html`
            <oryx-notification type="info" scheme="dark">
              ${i18n(
                'user.profile.you-can’t-log-out-because-of-a-pending-synchronization'
              )}.
            </oryx-notification>
          `
      )}
      ${when(
        isPicking,
        () =>
          html`
            <oryx-notification type="info" scheme="dark">
              ${i18n(
                'user.profile.you-can’t-log-out-because-picking-is-in-progress'
              )}.
            </oryx-notification>
          `
      )}

      <div class="info-footer">
        <oryx-button type="secondary" outline>
          <button
            ?disabled="${isPicking || this.pendingSyncs()}"
            @click=${this.onLogOut}
          >
            ${i18n('user.profile.log-Out')}
          </button>
        </oryx-button>

        ${when(
          isMainPage,
          () =>
            html`
              <oryx-button ?loading=${this.loading} type="secondary" outline>
                <button @click=${this.onReceiveData}>
                  ${i18n('user.profile.receive-Data')}
                </button>
              </oryx-button>
            `
        )}
      </div>
    `;
  }

  protected onReceiveData(): void {
    this.injectorDataPlugin
      .refreshData(this.injector)
      .pipe(
        tap(() => (this.loading = true)),
        delay(500)
      )
      .subscribe(() => {
        this.dispatchEvent(
          new CustomEvent(CLOSE_EVENT, {
            bubbles: true,
            composed: true,
          })
        );

        this.loading = false;
        this.routerService.navigate('/');
      });
  }

  protected onLogOut(): void {
    this.authService.logout();
  }
}
