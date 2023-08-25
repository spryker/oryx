import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
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
import { SiteBreadcrumbOptions } from './breadcrumb.model';
import { siteBreadcrumbStyles } from './breadcrumb.styles';

@hydrate({ event: 'window:load' })
@signalAware()
@defaultOptions({ dividerIcon: IconTypes.Front, showDivider: true })
export class SiteBreadcrumbComponent extends I18nMixin(
  ContentMixin<SiteBreadcrumbOptions>(LitElement)
) {
  static styles = siteBreadcrumbStyles;

  protected breadcrumbService = resolve(BreadcrumbService);

  protected $breadcrumb = signal(this.breadcrumbService.get());

  protected override render(): TemplateResult[] {
    const breadcrumb = this.$breadcrumb();

    return breadcrumb?.map((b, index) => {
      const isLastItem = index + 1 === breadcrumb.length;
      return html`${this.renderBreadcrumb(b)}
      ${when(this.$options().showDivider && !isLastItem, () =>
        this.renderDivider()
      )}`;
    });
  }

  protected renderText({
    i18n,
    text,
  }: BreadcrumbItem): string | DirectiveResult | void {
    return i18n ? this.i18n(i18n.token, i18n.values) : text;
  }

  protected renderBreadcrumb(breadcrumb: BreadcrumbItem): TemplateResult {
    return html`<a href="${ifDefined(breadcrumb.url)}">
      ${this.renderText(breadcrumb)}
    </a>`;
  }

  protected renderDivider(): TemplateResult {
    return html`<oryx-icon .type="${this.$options().dividerIcon}"></oryx-icon>`;
  }
}
