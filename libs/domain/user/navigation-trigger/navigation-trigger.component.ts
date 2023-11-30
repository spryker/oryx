import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouteType, RouterService } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { UserService } from '@spryker-oryx/user';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';

@hydrate()
export class UserNavigationTriggerComponent extends ContentMixin(LitElement) {
  protected authService = resolve(AuthService);
  protected userService = resolve(UserService);
  protected routerService = resolve(RouterService);
  protected linkService = resolve(LinkService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());
  protected $loginLink = signal(
    this.linkService.get({ type: RouteType.Login })
  );
  protected $user = signal(this.userService.getUser());

  protected override render(): TemplateResult | void {
    const text = this.$isAuthenticated()
      ? this.$user()?.firstName ?? ''
      : this.i18n('auth.login');

    return html`
      <oryx-site-navigation-button
        .type=${ButtonType.Text}
        .text=${text}
        .icon=${IconTypes.User}
      ></oryx-site-navigation-button>
    `;
  }

  protected onClick(): void {
    const link = this.$loginLink();
    if (!this.$isAuthenticated() && link) {
      this.routerService.navigate(link);
    }
  }
}
