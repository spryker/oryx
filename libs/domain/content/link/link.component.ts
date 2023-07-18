import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { ContentLinkContent, ContentLinkOptions } from './link.model';

@hydrate()
export class ContentLinkComponent extends ContentMixin<
  ContentLinkOptions,
  ContentLinkContent
>(LitElement) {
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $link = computed(() => {
    const { url, type, id, params } = this.$options();
    if (url) return url;
    if (type) return this.semanticLinkService.get({ type: type, id, params });
    return null;
  });

  protected override render(): TemplateResult | void {
    const { button, icon, singleLine, color } = this.$options();

    if (button) {
      return html`<oryx-button custom>${this.renderLink()}</oryx-button>`;
    }

    return html`<oryx-link
      .color=${color}
      ?singleLine=${singleLine}
      .icon=${icon}
      >${this.renderLink()}
    </oryx-link>`;
  }

  protected renderLink(): TemplateResult {
    if (!this.$link()) return html`${this.$content()?.text}`;

    const { label, target } = this.$options();

    return html`
      <a
        part="anchor"
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
    const { button, icon } = this.$options();
    const renderIcon = !!button && !!icon;

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
