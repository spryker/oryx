import { OauthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './oauth-handler.styles';

export class OauthHandlerComponent extends LitElement {
  @property() providerId?: string;

  static styles = styles;

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
      <oryx-image resource="logo"></oryx-image>
      <oryx-heading><h3>${i18n('oauth.logging-you-in')}</h3></oryx-heading>
      <oryx-spinner></oryx-spinner>
    `;
  }
}

export default OauthHandlerComponent;
