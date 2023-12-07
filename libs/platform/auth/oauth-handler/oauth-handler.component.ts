import { OauthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { featureVersion, I18nMixin } from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './oauth-handler.styles';

export class OauthHandlerComponent extends I18nMixin(LitElement) {
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
      ${this.__renderHeading()}
      <oryx-spinner></oryx-spinner>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): unknown {
    const text = this.i18n('oauth.logging-you-in');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading .tag=${HeadingTag.H3}> ${text} </oryx-heading>`;
    } else {
      return html`<oryx-heading>
        <h3>${text}</h3>
      </oryx-heading>`;
    }
  }
}

export default OauthHandlerComponent;
