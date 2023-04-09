import { TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  queryFirstFocusable,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { of, switchMap } from 'rxjs';
import {
  NavigationContentBehavior,
  NavigationTriggerBehavior,
  NavigationTriggerType,
  SiteNavigationItemOptions,
} from './navigation-item.model';
import { styles } from './navigation-item.styles';

@defaultOptions({
  triggerType: NavigationTriggerType.StorefrontButton,
  triggerBehavior: NavigationTriggerBehavior.Click,
  contentBehavior: NavigationContentBehavior.Navigation,
})
@hydratable('window:load')
export class SiteNavigationItemComponent extends ContentMixin<SiteNavigationItemOptions>(
  LitElement
) {
  static styles = styles;

  protected tokenResolver = resolve(TokenResolver);

  @asyncState()
  protected label = valueType(
    this.options$.pipe(
      switchMap(({ label }) => {
        if (!label) {
          return of();
        }

        return this.tokenResolver.resolveToken(label);
      })
    )
  );

  @asyncState()
  protected badge = valueType(
    this.options$.pipe(
      switchMap(({ badge }) => {
        if (!badge) {
          return of();
        }

        return this.tokenResolver.resolveToken(badge);
      })
    )
  );

  @asyncState()
  protected url = valueType(
    this.options$.pipe(
      switchMap(({ url }) => {
        if (typeof url !== 'object') {
          return of(url);
        }

        return resolve(SemanticLinkService).get(url);
      })
    )
  );

  protected onTriggerClick(): void {
    if (
      this.componentOptions?.contentBehavior === NavigationContentBehavior.Modal
    ) {
      this.renderRoot
        .querySelector('oryx-modal')
        ?.toggleAttribute('open', true);
    }
  }

  protected onTriggerHover(e: MouseEvent): void {
    if (
      this.componentOptions?.triggerBehavior !== NavigationTriggerBehavior.Hover
    ) {
      return;
    }

    //imitate mousedown behavior
    const trigger = e.target as HTMLElement;
    //focus focusable part of the trigger
    (
      (trigger.querySelector('a, button') ||
        queryFirstFocusable(trigger)) as HTMLElement
    )?.focus();
    this.onTriggerClick();
  }

  protected override render(): TemplateResult {
    switch (this.componentOptions?.contentBehavior) {
      case NavigationContentBehavior.Dropdown:
        return this.renderContentDropdown();
      case NavigationContentBehavior.Modal:
        return this.renderContentModal();
      case NavigationContentBehavior.Navigation:
      default:
        return this.renderContentNavigation();
    }
  }

  protected renderComposition(): TemplateResult {
    return html`<experience-composition
      uid=${ifDefined(this.uid)}
      close-popover
    ></experience-composition>`;
  }

  protected get icon(): TemplateResult | void {
    if (!this.componentOptions?.icon) return;

    return html`<oryx-icon .type=${this.componentOptions?.icon}></oryx-icon>`;
  }

  protected renderIconButton(): TemplateResult {
    return html`
      <oryx-icon-button
        slot="trigger"
        @click=${this.onTriggerClick}
        @mouseenter=${this.onTriggerHover}
      >
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
      <oryx-button
        slot="trigger"
        @click=${this.onTriggerClick}
        @mouseenter=${this.onTriggerHover}
      >
        ${when(
          this.url,
          () => html`<a href=${this.url!}> ${this.icon} ${this.label} </a>`,
          () => html`<button>${this.icon} ${this.label}</button>`
        )}
      </oryx-button>
    `;
  }

  protected renderCustomButton(): TemplateResult {
    return html`
      <oryx-site-navigation-button
        slot="trigger"
        .url=${this.url}
        .icon=${this.componentOptions?.icon}
        .text=${this.label}
        .badge=${this.badge}
        @click=${this.onTriggerClick}
        @mouseenter=${this.onTriggerHover}
      ></oryx-site-navigation-button>
    `;
  }

  protected renderTrigger(): TemplateResult {
    switch (this.componentOptions?.triggerType) {
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
      <oryx-modal
        enableCloseButtonInHeader
        enableCloseByEscape
        enableCloseByBackdrop
      >
        ${this.renderComposition()}
      </oryx-modal>
    `;
  }

  protected renderContentDropdown(): TemplateResult {
    return html`
      <oryx-dropdown position="start" vertical-align>
        ${this.renderTrigger()} ${this.renderComposition()}
      </oryx-dropdown>
    `;
  }
}
