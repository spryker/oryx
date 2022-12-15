import { AuthService } from '@spryker-oryx/auth';
import {
  ComponentMixin,
  ContentController,
  RouterService,
} from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, subscribe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit-html/directive';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  of,
  ReplaySubject,
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

  @property() heading?: DirectiveResult | string;

  protected options$ = this.contentController.getOptions();
  protected success$ = new BehaviorSubject(true);
  protected loading$ = new BehaviorSubject(false);
  protected data$ = combineLatest([
    this.options$,
    this.loading$,
    this.success$,
  ]);

  protected authTrigger$ = new ReplaySubject<LoginParameters>(1);

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
          ${
            success
              ? ''
              : html`<oryx-notification type="error">
                  ${i18n('the-email-or/and-password-entered-is-not-valid')}
                </oryx-notification>`
          }
          <form @submit=${this.handleLogin} method="post">
            <oryx-input label="${i18n(
              'email'
            )} *" ?haserror="${!success}"><input type="email" name="email" placeholder="${i18n(
          'email'
        )}" required/></oryx-input>
            <oryx-password-input ?haserror="${!success}" label="${i18n(
          'password'
        )} *" strategy="${ifDefined(
          options.strategy
        )}"/><input type="password" name="password" placeholder="${i18n(
          'password'
        )}" required/></oryx-password-input>
            <div class="options">
              ${when(
                options.showRememberMe,
                () => html` <oryx-checkbox>
                  <input type="checkbox" name="rememberme" />
                  ${i18n('user.login.remember-me')}
                </oryx-checkbox>`,
                () => html`<span></span>`
              )}
              <oryx-link><a href="#">${i18n(
                'user.login.forgot-password?'
              )}</a></oryx-link>
            </div>
            <oryx-button size="small"><button type="submit" ?disabled=${loading}>${i18n(
          'user.login.login'
        )}</button></oryx-button>
          </form>
        `
      )}
    </oryx-card>`;
  }
}
