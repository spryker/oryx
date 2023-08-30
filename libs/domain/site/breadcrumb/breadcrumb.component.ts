import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
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

  protected renderText({
    text,
  }: BreadcrumbItem): string | DirectiveResult | void {
    return text?.token ? this.i18n(text.token, text?.values) : text?.raw;
  }

  protected renderBreadcrumb(
    breadcrumb: BreadcrumbItem,
    isLastItem: boolean
  ): TemplateResult {
    return html`
      <oryx-button
        ?disabled="${isLastItem}"
        .href=${breadcrumb.url}
        .type=${ButtonType.Text}
        .size=${ButtonSize.Sm}
        .color=${ButtonColor.Neutral}
        >${this.renderText(breadcrumb)}</oryx-button
      >
    `;
  }

  protected renderDivider(): TemplateResult {
    return html`<oryx-icon
      .type="${this.$options().divider}"
      .size="${Size.Sm}"
    ></oryx-icon>`;
  }
}
