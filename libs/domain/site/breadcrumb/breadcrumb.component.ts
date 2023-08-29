import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  I18nMixin,
  Size,
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
@defaultOptions({ divider: IconTypes.Forward })
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
      return html`${this.renderBreadcrumb(b, isLastItem)}
      ${when(this.$options().divider && !isLastItem, () =>
        this.renderDivider()
      )}`;
    });
  }

  protected renderText({text}: BreadcrumbItem): string | DirectiveResult | void {
    return typeof text === 'object' ? this.i18n(text.token, text.values) : text;
  }

  protected renderBreadcrumb(breadcrumb: BreadcrumbItem, isLastItem: boolean): TemplateResult {
    if (isLastItem) {
      return html`<span>${this.renderText(breadcrumb)}</span>`;
    }

    return html`<a href="${ifDefined(breadcrumb.url)}">
      ${this.renderText(breadcrumb)}
    </a>`;
  }

  protected renderDivider(): TemplateResult {
    return html`<oryx-icon .type="${this.$options().divider}" .size="${Size.Sm}"></oryx-icon>`;
  }
}
