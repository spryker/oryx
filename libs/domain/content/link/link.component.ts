import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { ContentLinkContent, ContentLinkOptions } from './link.model';

@hydratable(['mouseover', 'focusin'])
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
      return html`<oryx-button>${this.renderLink()}</oryx-button>`;
    }

    return html`<oryx-link
      .color=${color}
      ?singleLine=${singleLine}
      .icon=${icon}
    >
      ${this.renderLink()}
    </oryx-link>`;
  }

  protected renderLink(): TemplateResult {
    const { label, target } = this.$options();

    const icon = this.$options().button && this.$options().icon;

    return html`
      <a
        href=${this.$link()}
        aria-label=${ifDefined(label)}
        target=${ifDefined(target)}
        rel=${ifDefined(this.getRel())}
        ><slot>
          ${when(
            icon,
            () => html`<oryx-icon .type=${this.$options().icon}></oryx-icon>`
          )}
          ${this.$content()?.text}</slot
        ></a
      >
    `;
  }

  protected getRel(): string | undefined {
    const { noopener, nofollow } = this.$options();
    return [noopener && 'noopener', nofollow && 'nofollow']
      .filter((rel) => !!rel)
      .join(' ');
  }
}
