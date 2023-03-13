import { resolve } from '@spryker-oryx/di';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  asyncState,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { UserService } from '@spryker-oryx/user';
import { triggerStyles } from './trigger.styles';
import { property } from 'lit/decorators';

export class UserSummaryTriggerComponent extends LitElement {
  static styles = triggerStyles;

  @property()
  icon = 'user';

  @asyncState()
  protected user = valueType(resolve(UserService).getUser());

  @asyncState()
  protected link = valueType(
    resolve(SemanticLinkService).get({ type: SemanticLinkType.Login })
  );

  protected override render(): TemplateResult {
    const innerContent = html`<oryx-icon type=${this.icon}></oryx-icon>
      <oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1}>
        ${when(
          this.user,
          () => this.user?.firstName,
          () => i18n('user.login')
        )}
      </oryx-heading>`;

    return html`
      <oryx-button>
        ${when(
          this.user,
          () => html`<button>${innerContent}</button>`,
          () =>
            html`<a href=${ifDefined(this.link)}>
              ${innerContent}
            </a>`
        )}
      </oryx-button>
    `;
  }
}
