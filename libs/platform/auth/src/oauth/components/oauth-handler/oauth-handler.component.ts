import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { OauthService } from '../../oauth.service';

export class OauthHandlerComponent extends LitElement {
  @property() providerId?: string;

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
    return html`<p><oryx-spinner></oryx-spinner></p>
      <p style="text-align: center;">${i18n('oauth.logging-you-in')}</p>`;
  }
}

export default OauthHandlerComponent;
