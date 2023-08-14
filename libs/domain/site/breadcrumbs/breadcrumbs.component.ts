import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { Breadcrumb, BreadcrumbsService } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  I18nMixin,
  hydrate,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { DirectiveResult } from 'lit/directive';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { SiteBreadcrumbsOptions } from './breadcrumbs.model';
import { siteBreadcrumbsStyles } from './breadcrumbs.styles';

@hydrate({ event: 'window:load' })
@signalAware()
@defaultOptions({ dividerIcon: IconTypes.Front, showDivider: true })
export class SiteBreadcrumbsComponent extends I18nMixin(
  ContentMixin<SiteBreadcrumbsOptions>(LitElement)
) {
  static styles = siteBreadcrumbsStyles;

  protected breadcrumbsService = resolve(BreadcrumbsService);

  protected $breadcrumbs = signal(this.breadcrumbsService.get());

  protected override render(): TemplateResult[] {
    const breadcrumbs = this.$breadcrumbs();

    return breadcrumbs.map((b, index) => {
      const isLastItem = index + 1 === breadcrumbs.length;
      return html`${this.renderBreadcrumb(b)}
      ${when(!isLastItem, () => this.renderDivider())}`;
    });
  }

  protected renderText({
    i18n,
    text,
  }: Breadcrumb): string | DirectiveResult | void {
    return i18n ? this.i18n(i18n.token, i18n.values) : text;
  }

  protected renderBreadcrumb(breadcrumb: Breadcrumb): TemplateResult {
    return html`<a href="${ifDefined(breadcrumb.url)}">
      ${this.renderText(breadcrumb)}
    </a>`;
  }

  protected renderDivider(): TemplateResult | void {
    if (!this.$options().showDivider) return;
    return html`<oryx-icon .type="${this.$options().dividerIcon}"></oryx-icon>`;
  }
}
