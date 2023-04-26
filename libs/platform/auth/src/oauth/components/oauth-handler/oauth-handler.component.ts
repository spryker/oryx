import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { OauthService } from '../../oauth.service';
import { styles } from './oauth-handler.styles';

export class OauthHandlerComponent extends LitElement {
  @property() providerId?: string;

  static styles = [styles];

  constructor(
    protected oauthService = resolve(OauthService),
    protected routerService = resolve(RouterService)
  ) {
    super();
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.providerId) {
      throw new Error(`OauthHandlerComponent: Unknown Oauth provider ID!`);
    }

    this.oauthService.handleCallback(this.providerId);
  }

  protected render(): unknown {
    return html`
      <div class="logo">
        <oryx-image
          resource="logo"
          style="color: var(--oryx-color-canvas-100);"
        ></oryx-image>
      </div>
      <div class="text">
        <oryx-heading><h3>${i18n('oauth.logging-you-in')}</h3></oryx-heading>
      </div>
      <div class="spinner">
        <oryx-spinner
          style="color: var(--oryx-color-canvas-100);"
          size="xl"
        ></oryx-spinner>
      </div>
    `;
  }
}

export default OauthHandlerComponent;
