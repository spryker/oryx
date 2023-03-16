import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { MenuListItem } from './menu-item.model';
import { styles } from './menu-item.styles';

export class MenuItemComponent extends LitElement {
  static styles = styles;

  @property() eventName?: string;
  @property({ type: Array }) items?: MenuListItem[];

  protected onClick(): void {
    if (this.eventName) {
      this.dispatchEvent(
        new CustomEvent(this.eventName, {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  protected renderTrigger(): TemplateResult {
    // const icon = html`<oryx-icon
    //   .type=${this.componentOptions?.icon}
    // ></oryx-icon>`;

    // if (this.componentOptions?.type === MenuItemTypes.Icon) {
    //   return html`
    //     <oryx-icon-button slot="trigger">
    //       ${when(
    //         this.isLink,
    //         () => html`<a href=${this.componentOptions.url!}>${icon}</a>`,
    //         () => html`<button @click=${this.onClick}>${icon}</button>`
    //       )}
    //     </oryx-icon-button>
    //   `;
    // }

    return html`<slot
      name="trigger"
      slot="trigger"
      @click=${this.onClick}
    ></slot>`;
  }

  protected renderMenuItemsList(): TemplateResult {
    if (!this.items) {
      return html``;
    }

    return html`
      ${this.items.map(
        (item) => html` <oryx-button type="text">
          <a href=${item.link} close-popover>
            ${when(
              !!item.icon,
              () => html`<oryx-icon .type=${item.icon}></oryx-icon>`
            )}
            ${item.title}
          </a>
        </oryx-button>`
      )}
    `;
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-dropdown position="start" vertical-align>
        ${this.renderTrigger()} ${this.renderMenuItemsList()}
        <slot></slot>
      </oryx-dropdown>
    `;
  }
}
