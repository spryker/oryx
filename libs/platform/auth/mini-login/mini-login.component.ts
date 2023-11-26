import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';

@hydrate()
export class MiniLoginLinkComponent extends LayoutMixin(
  ContentMixin(LitElement)
) {
  //   static styles = styles;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  protected $isAuthenticated = signal(this.authService.isAuthenticated());

  protected override render(): TemplateResult | void {
    // if (!this.$options()?.enableLogout && this.$isAuthenticated()) {
    //   return;
    // }
    return this.renderLayout({
      template: html`
        <oryx-button
          .type=${ButtonType.Text}
          .text=${this.i18n('auth.login')}
          .icon=${IconTypes.User}
          style="color:inherit"
        ></oryx-button>
      `,
    });
  }

  protected onClick(): void {
    if (!this.$isAuthenticated()) {
      this.routerService.navigate('/login');
      return;
    }
  }
}
