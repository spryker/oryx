import { AuthService } from '@spryker-oryx/auth';
import { AppRef } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { RouterService } from '@spryker-oryx/router';
import { CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import {
  computed,
  I18nMixin,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { userProfileComponentStyles } from './user-profile.styles';

@signalAware()
export class UserProfileComponent extends I18nMixin(LitElement) {
  static styles = userProfileComponentStyles;

  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);

  protected injector = resolve(INJECTOR);
  protected injectorDataPlugin =
    resolve(AppRef).requirePlugin(OfflineDataPlugin);

  @state()
  protected loading: boolean | null = null;

  @state()
  protected logoutLoading = false;

  protected $route = signal(this.routerService.route());
  protected $pendingSyncs = signal(resolve(SyncSchedulerService).hasPending());
  protected $isPicking = computed(() => this.$route()?.includes('/picking/'));
  protected $isMainPage = computed(() => this.$route() === '/');
  protected $pickingInProgress = computed(() =>
    this.i18n("user.profile.you-can't-log-out-because-picking-is-in-progress")
  );
  protected $pendingSync = computed(() =>
    this.i18n(
      "user.profile.you-can't-log-out-because-of-a-pending-synchronization"
    )
  );

  protected override render(): TemplateResult {
    return html`
      <div class="info-block">
        <dl>
          <dt class="info-label">${this.i18n('user.profile.employee-id')}</dt>
          <dd class="info-value">admin@spryker.com</dd>
        </dl>
      </div>

      ${when(
        this.$pendingSyncs() || this.$isPicking(),
        () =>
          html`
            <oryx-notification type="info" scheme="dark">
              ${this.$isPicking()
                ? this.$pickingInProgress()
                : this.$pendingSync()}
            </oryx-notification>
          `
      )}

      <div class="info-footer">
        <oryx-button ?loading=${this.logoutLoading} type="secondary" outline>
          <button
            ?disabled="${this.$isPicking() || this.$pendingSyncs()}"
            @click=${this.onLogOut}
          >
            ${this.i18n('user.profile.log-Out')}
          </button>
        </oryx-button>

        ${when(
          this.$isMainPage(),
          () =>
            html`
              <oryx-button ?loading=${this.loading} type="secondary" outline>
                <button @click=${this.onReceiveData}>
                  ${this.i18n('user.profile.receive-Data')}
                </button>
              </oryx-button>
            `
        )}
      </div>
      <!-- HACK: Prerender translation texts for E2E tests to pass -->
      <!-- ${this.$pickingInProgress()} ${this.$pendingSync()} -->
    `;
  }

  protected onReceiveData(): void {
    this.loading = true;

    this.injectorDataPlugin
      .refreshData(this.injector)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(() => {
        this.dispatchEvent(
          new CustomEvent(CLOSE_EVENT, {
            bubbles: true,
            composed: true,
          })
        );
        this.routerService.navigate('/');
      });
  }

  protected onLogOut(): void {
    this.logoutLoading = true;
    this.authService.logout().subscribe({
      error: (e) => {
        this.logoutLoading = false;
      },
    });
  }
}
