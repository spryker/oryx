import { resolve } from '@spryker-oryx/di';
import { Component, ContentMixin, defaultOptions, ExperienceService } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import { asyncState, hydratable, observe, valueType } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { async, BehaviorSubject, map, of, switchMap } from 'rxjs';
import { NavigationContentContainer, NavigationTriggerType, SiteNavigationItemOptions } from './navigation-item.model';
import { styles } from './navigation-item.styles';

@defaultOptions({
  triggerType: NavigationTriggerType.StorefrontButton,
  contentContainer: NavigationContentContainer.Dropdown,
})
@hydratable('window:load')
export class SiteNavigationItemComponent extends ContentMixin<SiteNavigationItemOptions>(
  LitElement
) {
  static styles = styles;

  @asyncState()
  protected components = valueType(this.components$);

  @asyncState()
  protected url = valueType(this.options$.pipe(
    switchMap(({url}) => {
      if (!url) {
        return of();
      }

      if (typeof url !== 'object'){
        return of(url);
      }

      return resolve(SemanticLinkService).get(url);
    }))
  );

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
    return this.componentOptions?.label ?? '';
  }

  protected get icon(): TemplateResult {
    if (!this.componentOptions?.icon){
      return html``;
    }

    return html`<oryx-icon
      .type=${this.componentOptions?.icon}
    ></oryx-icon>`;
  }

  protected renderIconButton(): TemplateResult {
    return html`
      <oryx-icon-button slot="trigger">
        ${when(
          this.url,
          () => html`<a href=${this.url!}>${this.icon}</a>`,
          () => html`<button>${this.icon}</button>`
        )}
      </oryx-icon-button>
    `;
  }

  protected renderButton(): TemplateResult {
    return html`
      <oryx-button slot="trigger">
        ${when(
          this.url,
          () => html`<a href=${this.url!}>
            ${this.icon}
            ${this.resolveLabel()}
          </a>`,
          () => html`<button>
            ${this.icon}
            ${this.resolveLabel()}
          </button>`
        )}
      </oryx-button>
    `;
  }

  protected renderCustomButton(): TemplateResult {
    return html`
      <oryx-site-navigation-button 
        slot="trigger"
        url=${ifDefined(this.url)}
        icon=${ifDefined(this.componentOptions?.icon)}
        text=${this.resolveLabel()}
        badge=${ifDefined(this.componentOptions?.badge)}
      ></oryx-site-navigation-button>
    `;
  }

  protected renderTrigger(): TemplateResult {
    switch(this.componentOptions?.triggerType) {
      case NavigationTriggerType.Icon:
        return this.renderIconButton();
      case NavigationTriggerType.Button:
        return this.renderButton();
      case NavigationTriggerType.StorefrontButton:
      default:
        return this.renderCustomButton();
    }
  }

  protected renderContentNavigation(): TemplateResult {
    return this.renderTrigger();
  }

  protected renderContentModal(): TemplateResult {
    return html`
      ${this.renderTrigger()} 
      <oryx-modal>
        <!-- menuitems -->
        <!-- components -->
      </oryx-modal>
    `;
  }

  protected renderContentDropdown(): TemplateResult {
    return html`
      <oryx-dropdown position="start" vertical-align>
        ${this.renderTrigger()} 
        <!-- menuitems -->
        <!-- components -->
      </oryx-dropdown>
    `;
  }

  // protected renderMenuItemsList(): TemplateResult {
  //   if (!this.items?.length) {
  //     return html``;
  //   }

  //   return html`
  //     ${this.items.map(
  //       (item) => html` <oryx-button type="text">
  //         <a href=${item.link} close-popover>
  //           ${when(
  //             !!item.icon,
  //             () => html`<oryx-icon .type=${item.icon}></oryx-icon>`
  //           )}
  //           ${item.title}
  //         </a>
  //       </oryx-button>`
  //     )}
  //   `;
  // }

  protected override render(): TemplateResult {
    switch(this.componentOptions?.contentContainer) {
      case NavigationContentContainer.Dropdown:
        return this.renderContentDropdown();
      case NavigationContentContainer.Modal:
        return this.renderContentModal();
      case NavigationContentContainer.Navigation:
      default:
        return this.renderContentNavigation();
    }
  }
}
