import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { UserService } from '../../src/services';
import { UserSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@hydratable('window:load')
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

  protected renderTriggerButton(isAuthenticated: boolean): TemplateResult {
    const innerContent = html`<oryx-icon type="user"></oryx-icon>
      <oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1} disappear-sm>
        ${when(
          isAuthenticated,
          () => this.user?.firstName,
          () => i18n('user.login')
        )}
      </oryx-heading>`;

    return html`
      <oryx-button slot="trigger">
        ${when(
          isAuthenticated,
          () => html`<button class="trigger">${innerContent}</button>`,
          () =>
            html`<a href=${ifDefined(this.link)} class="trigger">
              ${innerContent}
            </a>`
        )}
      </oryx-button>
    `;
  }

  protected renderDropdown(): TemplateResult {
    return html`
      ${when(this.options?.items?.length, () =>
        this.options!.items!.map(
          (item) => html`
            <oryx-button type="text">
              <a href=${item.link} class="dropdown-link" close-popover>
                ${when(
                  item.icon,
                  () => html`<oryx-icon type=${item.icon}></oryx-icon>`
                )}
                ${item.title}
              </a>
            </oryx-button>
          `
        )
      )}
      <oryx-auth-logout></oryx-auth-logout>
    `;
  }

  protected override render(): TemplateResult {
    if (!this.user) {
      return this.renderTriggerButton(false);
    }

    return html`
      <oryx-dropdown position="start" vertical-align>
        ${this.renderTriggerButton(true)} ${this.renderDropdown()}
      </oryx-dropdown>
    `;
  }
}
