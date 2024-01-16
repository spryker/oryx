import { ContentService } from '@spryker-oryx/content';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductCategoryService, ProductService } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { ActionType } from '@spryker-oryx/ui/action';
import {
  computed,
  elementEffect,
  featureVersion,
  hydrate,
  signalAware,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { map, of } from 'rxjs';
import { ContentLinkContent, ContentLinkOptions } from './link.model';
import { contentLinkStyles } from './link.styles';

@ssrShim('style')
@hydrate()
@signalAware()
export class ContentLinkComponent extends ContentMixin<
  ContentLinkOptions,
  ContentLinkContent
>(LitElement) {
  static styles = featureVersion >= '1.3' ? contentLinkStyles : undefined;

  protected semanticLinkService = resolve(LinkService);
  protected categoryService = resolve(ProductCategoryService);
  protected productService = resolve(ProductService);
  protected contentService = resolve(ContentService);

  protected $link = computed(() => {
    const { url, type, id, qualifier, params } = this.$options();
    if (url) return of(url);
    if (type)
      return this.semanticLinkService.get({
        type: type,
        id,
        qualifier,
        params,
      });
    return of(null);
  });

  protected $isCurrent = computed(() => {
    const link = this.$link();
    if (link) return this.semanticLinkService.isCurrent(link);
    return of(false);
  });

  @elementEffect()
  protected reflectCurrentRoute = (): void => {
    const current = this.$isCurrent();
    this.toggleAttribute('current', current);
  };

  protected override render(): TemplateResult | void {
    const { button, icon, singleLine, color } = this.$options();

    if (button) {
      return html`<oryx-button part="link" }
        >${this.renderLink(true)}</oryx-button
      >`;
    }

    return html`<oryx-action
      type=${ActionType.Text}
      .icon=${icon}
      .href=${this.$link()}
      .text=${this.$text()}
      ?active=${this.$isCurrent()}
    ></oryx-action>`;

    // return html`<oryx-link
    //   part="link"
    //   .color=${color}
    //   ?singleLine=${singleLine}
    //   .icon=${icon}
    //   >${this.renderLink()}
    // </oryx-link>`;
  }

  protected $text = computed(() => {
    const { type, id, qualifier } = this.$options();
    const { text } = this.$content() ?? {};

    if (text) return text;

    if (type === RouteType.Category && id) {
      return this.categoryService
        .get(id)
        .pipe(map((category) => category?.name));
    }

    if (type === RouteType.Product && (id || qualifier)) {
      return this.productService
        .get(qualifier ?? { sku: id })
        .pipe(map((product) => product?.name));
    }

    return this.contentService
      .get({ type, id })
      .pipe(map((content) => content?.name));
  });

  protected renderLink(custom?: boolean): TemplateResult {
    if (!this.$link()) return html`<a tabindex="0">${this.$text()}</a>`;

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
    const text = this.$text();
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
