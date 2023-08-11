import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  I18nMixin,
  hydrate,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { siteBreadcrumbsStyles } from './breadcrumbs.styles';
import { resolve } from '@spryker-oryx/di';
import { Breadcrumb, BreadcrumbsService } from '@spryker-oryx/site';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { SiteBreadcrumbsOptions } from './breadcrumbs.model';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DirectiveResult } from 'lit/directive';

@hydrate({event: 'window:load'})
@signalAware()
@defaultOptions({dividerIcon: IconTypes.Front, showDivider: true})
export class SiteBreadcrumbsComponent extends I18nMixin(ContentMixin<SiteBreadcrumbsOptions>(
  LitElement
)) {
  static styles = siteBreadcrumbsStyles;

  protected breadcrumbsService = resolve(BreadcrumbsService);

  protected $breadcrumbs = signal(this.breadcrumbsService.get());
 
  protected override render(): TemplateResult | void {
    const breadcrumbs = this.$breadcrumbs();
    if (!breadcrumbs?.length) return;
    
    return html`${repeat(
      breadcrumbs,
      b => b.url ?? b.text ?? b.i18n?.token,
      (b, index) => {
        const isLastItem = index + 1 === breadcrumbs.length;
        return html`${this.renderBreadcrumb(b)} ${when(
          !isLastItem,
          () => this.renderDivider()
        )}`
      }
    )}`
  }

  protected renderText({i18n, text}: Breadcrumb): string | DirectiveResult | void {
    return i18n ? this.i18n(i18n.token, i18n.values) : text;
  }

  protected renderBreadcrumb(breadcrumb: Breadcrumb): TemplateResult {
    return  html`<a href="${ifDefined(breadcrumb.url)}">
      ${this.renderText(breadcrumb)}
    </a>`;
  }

  protected renderDivider(): TemplateResult | void {
    if (!this.$options().showDivider) return;
    return  html`<oryx-icon .type="${this.$options().dividerIcon}"></oryx-icon>`;
  }
}
