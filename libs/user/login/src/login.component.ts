import { AuthService, hydratable } from '@spryker-oryx/core';
import {
  ComponentMixin,
  ContentController,
  RouterService,
} from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, subscribe } from '@spryker-oryx/lit-rxjs';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  ReplaySubject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { LoginOptions, LoginParameters } from './login.model';
import { styles } from './login.styles';

export const TAG_NAME = 'user-login';

@hydratable(['mouseover', 'focus'])
export class UserLoginComponent extends ComponentMixin<LoginOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected semanticLink = resolve(SemanticLinkService);
  protected routerService = resolve(RouterService);
  protected authService = resolve(AuthService);

  protected options$ = this.contentController.getOptions();
  protected loading$ = new BehaviorSubject(false);
  protected data$ = combineLatest([this.options$, this.loading$]);

  protected authTrigger$ = new ReplaySubject<LoginParameters>(1);

  @subscribe()
  protected auth$ = this.authTrigger$.pipe(
    switchMap((user) => {
      this.loading$.next(true);
      return this.authService.login(user.email, user.password, user.rememberme);
    }),
    withLatestFrom(this.options$),
    switchMap(([success, options]) => {
      if (!success) {
        return this.semanticLink
          ?.get?.({ type: SemanticLinkType.Page, id: 'unauthorized' })
          .pipe(
            tap((link) => {
              this.routerService.navigate(link ?? '');
            })
          );
      }
      if (options.url) {
        this.routerService.navigate(options.url);
        return EMPTY;
      }
      this.routerService.back();
      return EMPTY;
    }),
    tap(() => this.loading$.next(false))
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
    return html`${asyncValue(this.data$, ([options, loading]) => {
      return html`<oryx-card>
      <h1 slot="header">Access your account</h1>
      <form @submit=${this.handleLogin} method="post">
        <oryx-input label="Email *"><input name="email" placeholder="Email" required/></oryx-input>
        <oryx-password-input label="Password *" strategy="${ifDefined(
          options.strategy
        )}"/><input type="password" name="password" placeholder="Password" required/></oryx-password-input>
        <div class="options">
          ${
            options.showRememberMe
              ? html` <oryx-checkbox>
                  <label>
                    <input type="checkbox" name="rememberme" />
                    Remember me
                  </label>
                </oryx-checkbox>`
              : html`<span></span>`
          }
          <oryx-link><a href="#">Forgot Password?</a></oryx-link>
        </div>
        <oryx-button size="small"><button type="submit" ?disabled=${loading}>Login</button></oryx-button>
      </form>
    </oryx-card>`;
    })}`;
  }
}
