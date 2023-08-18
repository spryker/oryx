import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LinkService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  ContentLinkAppearance,
  ContentLinkContent,
  ContentLinkOptions,
} from './link.model';
import { styles } from './link.styles';

@hydrate()
export class ContentLinkComponent extends ContentMixin<
  ContentLinkOptions,
  ContentLinkContent
>(LitElement) {
  static styles = styles;

  @property({ reflect: true, type: Boolean })
  protected dropdown = false;

  protected semanticLinkService = resolve(LinkService);

  protected $link = computed(() => {
    const { url, type, id, params } = this.$options();
    if (url) return url;
    if (type) return this.semanticLinkService.get({ type: type, id, params });
    return null;
  });

  protected override render(): TemplateResult | void {
    const { appearance, button, icon, singleLine, color } = this.$options();

    this.dropdown = appearance === ContentLinkAppearance.DROPDOWN;

    if (button || this.dropdown) {
      return html`<oryx-button
        .type=${ifDefined(this.dropdown ? ButtonType.Text : undefined)}
        >${this.renderLink(true)}</oryx-button
      >`;
    }

    return html`<oryx-link
      .color=${color}
      ?singleLine=${singleLine}
      .icon=${icon}
      >${this.renderLink()}
    </oryx-link>`;
  }

  protected renderLink(custom?: boolean): TemplateResult {
    if (!this.$link()) return html`${this.renderContent()}`;

    const { label, target } = this.$options();

    return html`
      <a
        part="anchor"
        slot=${ifDefined(custom ? 'custom' : undefined)}
        href=${this.$link()}
        aria-label=${ifDefined(label)}
        target=${ifDefined(target)}
        rel=${ifDefined(this.getRel())}
      >
        ${this.renderContent()}
      </a>
    `;
  }

  protected renderContent(): TemplateResult {
    const { text } = this.$content() ?? {};
    const { button, icon, appearance } = this.$options();
    const renderIcon =
      (!!button || appearance === ContentLinkAppearance.DROPDOWN) && !!icon;

    if (text || icon) {
      return html` ${when(
        renderIcon,
        () => html`<oryx-icon .type=${icon}></oryx-icon>`
      )}
      ${text}`;
    }
    return html`<slot></slot>`;
  }

  protected getRel(): string | undefined {
    const { noopener, nofollow } = this.$options();
    return [noopener && 'noopener', nofollow && 'nofollow']
      .filter((rel) => !!rel)
      .join(' ');
  }
}
