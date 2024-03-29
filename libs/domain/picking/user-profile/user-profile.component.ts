import { AuthService, IdentityService } from '@spryker-oryx/auth';
import { AppRef, StorageService } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import { NetworkStateService } from '@spryker-oryx/offline';
import { SyncSchedulerService } from '@spryker-oryx/offline/sync';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import {
  WarehouseUserAssignment,
  warehouseUserAssignmentStorageKey,
} from '@spryker-oryx/picking/services';
import { RouterService } from '@spryker-oryx/router';
import { ButtonColor, ButtonType } from '@spryker-oryx/ui/button';
import { CLOSE_EVENT, CLOSE_MODAL_EVENT } from '@spryker-oryx/ui/modal';
import {
  ConnectableSignal,
  I18nMixin,
  computed,
  featureVersion,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { userProfileComponentStyles } from './user-profile.styles';

@signalAware()
export class PickingUserProfileComponent extends I18nMixin(LitElement) {
  static styles = userProfileComponentStyles;

  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);
  protected storageService = resolve(StorageService);
  protected identityService = resolve(IdentityService);
  protected networkStateService = resolve(NetworkStateService);

  protected injector = resolve(INJECTOR);
  protected injectorDataPlugin =
    resolve(AppRef).requirePlugin(OfflineDataPlugin);

  @state()
  protected loading: boolean | null = null;

  @state()
  protected logoutLoading = false;

  protected $location: ConnectableSignal<WarehouseUserAssignment | null> =
    signal(this.storageService.get(warehouseUserAssignmentStorageKey));
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
  protected $isOnline = signal(this.networkStateService.online());

  protected $identity = signal(this.identityService.get());

  protected override render(): TemplateResult {
    return html`
      <div class="info-block">
        ${when(
          this.$location(),
          () => html`
            <dl>
              <dt class="info-label">${this.i18n('user.profile.location')}</dt>
              <dd class="info-value">${this.$location()?.warehouse.name}</dd>
            </dl>
          `
        )}
        <dl>
          <dt class="info-label">${this.i18n('user.profile.employee-id')}</dt>
          <dd class="info-value">
            ${this.$identity().userId ??
            this.i18n('user.profile.unknown-user-id')}
          </dd>
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
        <oryx-button
          class="logout-button"
          .type=${ButtonType.Outline}
          .color=${ButtonColor.Neutral}
          .text=${this.i18n('user.profile.log-out')}
          block
          ?loading=${this.logoutLoading}
          ?disabled=${this.$isPicking() || this.$pendingSyncs()}
          @click=${this.onLogOut}
        ></oryx-button>

        ${when(
          this.$isMainPage(),
          () =>
            html`
              <oryx-button
                class="sync-data"
                .type=${ButtonType.Outline}
                .color=${ButtonColor.Neutral}
                .text=${this.i18n('user.profile.sync-data')}
                block
                ?loading=${this.loading}
                ?disabled=${!this.$isOnline()}
                @click=${this.onSyncData}
              ></oryx-button>
            `
        )}
      </div>
      <!-- HACK: Prerender translation texts for E2E tests to pass -->
      <!-- ${this.$pickingInProgress()} ${this.$pendingSync()} -->
    `;
  }

  protected onSyncData(): void {
    this.loading = true;

    this.injectorDataPlugin
      .syncData(this.injector)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(() => {
        const event = featureVersion >= '1.4' ? CLOSE_MODAL_EVENT : CLOSE_EVENT;
        this.dispatchEvent(
          new CustomEvent(event, {
            bubbles: true,
            composed: true,
          })
        );
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
