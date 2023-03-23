import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import { asyncState, hydratable, valueType } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { of, switchMap } from 'rxjs';
import { SiteNavigationItemOptions } from './navigation-item.model';
import { styles } from './navigation-item.styles';

@hydratable('window:load')
export class SiteNavigationItemComponent extends ContentMixin<SiteNavigationItemOptions>(
  LitElement
) {
  static styles = styles;

  @asyncState()
  protected link = valueType(this.options$.pipe(
    switchMap(({url}) => {
      if (typeof url !== 'object'){
        return of(url);
      }

      return resolve(SemanticLinkService).get(url);
    }))
  );

  // @property({ type: Array }) items?: MenuListItem[];

  // protected onClick(): void {
  //   if (this.eventName) {
  //     this.dispatchEvent(
  //       new CustomEvent(this.eventName, {
  //         bubbles: true,
  //         composed: true,
  //       })
  //     );
  //   }
  // }

  protected resolveLabel(): string {

  }

  protected resolveUrl(): string {

  }

  protected renderTriggersContent

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
