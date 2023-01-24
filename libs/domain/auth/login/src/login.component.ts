import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import {
  asyncValue,
  hydratable,
  i18n,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DirectiveResult } from 'lit/directive';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { LoginOptions, LoginParameters } from './login.model';
import { styles } from './login.styles';

@hydratable(['mouseover', 'focus'])
export class AuthLoginComponent extends ComponentMixin<LoginOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);
  protected i18nService = resolve(I18nService);

  @property() heading?: DirectiveResult | string;

  protected options$ = this.contentController.getOptions();
  protected success$ = new BehaviorSubject(true);
  protected loading$ = new BehaviorSubject(false);
  protected data$ = combineLatest([
    this.options$,
    this.loading$,
    this.success$,
  ]);

  protected authTrigger$ = new Subject<LoginParameters>();

  @subscribe()
  protected auth$ = this.authTrigger$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap((user) =>
      this.authService
        .login({
          username: user.email,
          password: user.password,
          remember: user.rememberme,
        })
        .pipe(
          catchError((e) => {
            this.success$.next(false);
            this.loading$.next(false);

            return EMPTY;
          })
        )
    ),
    withLatestFrom(this.options$),
    switchMap(([success, options]) => {
      if (!success) {
        this.success$.next(success);
        return of(undefined);
      }
      if (options.disableRedirect) {
        return of(undefined);
      }
      if (options.url) {
        this.routerService.navigate(options.url);
        return of(undefined);
      }
      return this.routerService.previousRoute().pipe(
        tap((previousPage) => {
          if (previousPage) {
            this.routerService.navigate(previousPage);
            return;
          }
          this.routerService.navigate('/');
        })
      );
    }),
    tap({
      next: () => this.success$.next(true),
      complete: () => this.loading$.next(false),
    })
  );

  protected handleLogin(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    this.authTrigger$.next({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberme: !!formData.get('rememberme'),
    });
  }

  // TODO: remove when `i18n` directive will be refactored
  protected i18n(token: string): Observable<string> {
    return this.i18nService.translate(token);
  }

  protected override render(): TemplateResult {
    return html`<oryx-card>
      <oryx-heading slot="header" appearance="h5">
        <h1>
          ${when(
            this.heading,
            () => html`${this.heading}`,
            () => html`${i18n('user.login.access-your-account')}`
          )}
        </h1>
      </oryx-heading>

      ${asyncValue(
        this.data$,
        ([options, loading, success]) => html`
          ${success
            ? ''
            : html`<oryx-notification type="error">
                ${i18n('the-email-or/and-password-entered-is-not-valid')}
              </oryx-notification>`}
          <form @submit=${this.handleLogin} method="post">
            ${asyncValue(
              this.i18n('email'),
              (text) => html`
                <oryx-input label="${text}" ?haserror="${!success}" required>
                  <input
                    type="email"
                    name="email"
                    placeholder="${i18n(text)}"
                    required
                  />
                </oryx-input>
              `
            )}
            ${asyncValue(
              this.i18n('password'),
              (text) => html`
                <oryx-password-input
                  label="${text}"
                  ?haserror="${!success}"
                  strategy="${ifDefined(options.strategy)}"
                  required
                >
                  <input
                    type="password"
                    name="password"
                    placeholder="${i18n(text)}"
                    required
                  />
                </oryx-password-input>
              `
            )}
            <div class="options">
              ${when(
                options.showRememberMe,
                () => html` <oryx-checkbox>
                  <input type="checkbox" name="rememberme" />
                  ${i18n('user.login.remember-me')}
                </oryx-checkbox>`,
                () => html`<span></span>`
              )}
              <oryx-link>
                <a href="#">${i18n('user.login.forgot-password?')}</a>
              </oryx-link>
            </div>
            <oryx-button size="small">
              <button type="submit" ?disabled=${loading}>
                ${i18n('user.login.login')}
              </button>
            </oryx-button>
          </form>
        `
      )}
    </oryx-card>`;
  }
}
