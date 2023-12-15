import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { UserService } from '@spryker-oryx/user';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';

@hydrate()
export class UserNavigationControlComponent extends ContentMixin(LitElement) {
  protected authService = resolve(AuthService);
  protected userService = resolve(UserService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());
  protected $user = signal(this.userService.getUser());

  protected override render(): TemplateResult | void {
    return html`
      <oryx-button .type=${ButtonType.Tile}>
        <oryx-icon .type=${IconTypes.User}></oryx-icon>
        ${this.$isAuthenticated()
          ? this.$user()?.firstName ?? ''
          : this.i18n('auth.login')}
      </oryx-button>
    `;
  }
}
