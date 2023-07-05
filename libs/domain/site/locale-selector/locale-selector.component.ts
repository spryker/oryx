import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';
import { siteLocaleSelectorStyles } from './locale-selector.styles';

@hydratable(['mouseover', 'focusin'])
export class SiteLocaleSelectorComponent extends ContentMixin(LitElement) {
  static styles = [siteLocaleSelectorStyles];

  protected localeService = resolve(LocaleService);

  protected $locales = signal(this.localeService.getAll(), {
    initialValue: [],
  });
  protected $current = signal(this.localeService.get());

  protected override render(): TemplateResult | void {
    const locales = this.$locales();

    if (!this.$current() || !locales?.length || locales.length < 2) {
      return;
    }

    return html`
      <oryx-dropdown vertical-align position="start">
        <oryx-button type=${ButtonType.Text} slot="trigger">
          <button>
            ${this.$current()}
            <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
          </button>
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
}
