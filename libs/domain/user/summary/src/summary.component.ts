import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { UserService } from '../../src/services';
import { MenuItemTypes, UserSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@hydratable('window:load')
@defaultOptions({
  icon: 'user'
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

  protected onClick(): void {

  }

  protected renderTrigger(): TemplateResult {
    const icon = html`<oryx-icon type=""></oryx-icon>`;
    
    if (this.componentOptions?.type === MenuItemTypes.Icon) {
      return html`
        <oryx-icon-button slot="trigger">
          ${when(
            this.componentOptions?.url,
            () => html`<a 
              href=${this.componentOptions.url!}
              @click=${this.onClick}
            >${icon}</a>
            `,
            () => html`<button
              @click=${this.onClick}
            >${icon}</button>`
          )}
          <button>
            
          </button>
        </oryx-icon-button>>
      `;
    }

    // TODO: url logic
    return html`
      <oryx-user-summary-trigger 
        slot="trigger"
        .icon=${this.componentOptions?.icon}
        .url=${this.componentOptions?.url}
      ></oryx-user-summary-trigger>
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
