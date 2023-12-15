import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { Position } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { featureVersion, hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { LocaleSelectorOptions } from './locale-selector.model';
import { siteLocaleSelectorStyles } from './locale-selector.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
@defaultOptions({
  enableFlag: true,
})
export class SiteLocaleSelectorComponent extends ContentMixin<LocaleSelectorOptions>(
  LitElement
) {
  static styles = [siteLocaleSelectorStyles];

  protected localeService = resolve(LocaleService);

  protected $locales = signal(this.localeService.getAll(), {
    initialValue: [],
  });
  protected $current = signal(this.localeService.get());

  protected override render(): TemplateResult | void {
    const locales = this.$locales();
    const current = this.$current();

    if (!current || !locales?.length || locales.length < 2) {
      return;
    }

    return html`
      <oryx-dropdown vertical-align .position=${Position.START}>
        <oryx-button
          slot="trigger"
          .size=${ButtonSize.Md}
          .type=${ButtonType.None}
        >
          ${when(
            this.$options().enableFlag,
            () => html`${this.getFlag(current)}`
          )}
          ${current}
          <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
        </oryx-button>
        ${repeat(
          this.$locales(),
          (locale) => locale.code,
          (locale) =>
            html` <oryx-option
              close-popover
              value=${locale.code}
              ?active=${locale.code === this.$current()}
              @click=${() => this.onClick(locale.code)}
            >
              ${this.getLabel(locale.code)}
            </oryx-option>`
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(locale: string): void {
    this.localeService.set(locale);
  }

  protected getLabel(code: string): string {
    const languageNames = new Intl.DisplayNames([code], {
      type: 'language',
    });
    return languageNames.of(code) ?? code;
  }

  /**
   * @returns Flag Emoji for the locale country (e.g. 🇺🇸)
   *
   * @since 1.2
   */
  protected getFlag(locale: string): TemplateResult {
    if (featureVersion < '1.2') return html``;
    const item = this.$locales().find((item) => item.code === locale);
    const country = item?.name.split('_')[1];
    return html`<span>
      ${(country ?? locale)
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        )}
    </span>`;
  }
}
