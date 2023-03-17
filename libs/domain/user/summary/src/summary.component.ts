import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { when } from 'lit-html/directives/when.js';
import { customElement } from 'lit/decorators.js';
import { UserService } from '../../src/services';
import { UserSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@customElement('oryx-account-summary-content')
export class UserSummaryContentComponent extends LitElement {
  protected override render(): TemplateResult {
    return html`<oryx-auth-logout></oryx-auth-logout>`;
  }
}

@hydratable('window:load')
@defaultOptions({
  icon: 'user',
})
export class UserSummaryComponent extends ContentMixin<UserSummaryOptions>(
  LitElement
) {
  static styles = styles;

  @asyncState()
  protected user = valueType(resolve(UserService).getUser());

  @asyncState()
  protected link = valueType(
    resolve(SemanticLinkService).get({ type: SemanticLinkType.Login })
  );

  protected override render(): TemplateResult {
    return html`
      <oryx-menu-item
        .items=${this.user ? this.componentOptions?.items : []}
      >
        <oryx-menu-item-button
          slot="trigger"
          .icon=${this.componentOptions?.icon}
          url=${ifDefined(this.url)}
        >
          <span slot="text"
            >${when(
              this.user,
              () => html`${this.user?.firstName}`,
              () => html`${i18n('user.login')}`
            )}</span
          >
        </oryx-menu-item-button>

        ${when(
          this.user,
          () => html`
            <oryx-account-summary-content></oryx-account-summary-content>
            <!-- <oryx-auth-logout></oryx-auth-logout> -->
          `
        )}
      </oryx-menu-item>
    `;
  }

  protected get url(): string | void {
    return !this.user ? this.link : undefined;
  }
}
