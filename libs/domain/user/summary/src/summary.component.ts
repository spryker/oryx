import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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

  protected renderTrigger(): TemplateResult {
    return html`
      <oryx-user-summary-trigger slot="trigger"></oryx-user-summary-trigger>
    `;
  }

  protected renderDropdown(): TemplateResult {
    return html`
      ${when(this.options?.items?.length, () =>
        this.options!.items!.map(
          (item) => html`
            <oryx-button type="text">
              <a href=${item.link} close-popover>
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
      return this.renderTrigger();
    }

    return html`
      <oryx-dropdown position="start" vertical-align>
        ${this.renderTrigger()} ${this.renderDropdown()}
      </oryx-dropdown>
    `;
  }
}
