import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, I18nMixin, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './account-link.styles';

@hydrate({ event: 'window:load' })
export class AccountLinkComponent extends I18nMixin(LitElement) {
  static styles = styles;
  protected authService = resolve(AuthService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    if (!this.$isAuthenticated()) {
      return;
    }

    return html`<oryx-button
      .type=${ButtonType.Text}
      .text=${this.i18n('user.account')}
      .icon=${IconTypes.User}
      href="/account/overview"
    ></oryx-button>`;
  }
}

export default AccountLinkComponent;
