import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { asyncState, valueType } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';
import { SiteLocaleSelectorOptions } from './locale-selector.model';
import { localeSelectorStyles } from './locale-selector.styles';

export class SiteLocaleSelectorComponent extends ContentMixin<SiteLocaleSelectorOptions>(
  LitElement
) {
  static styles = [localeSelectorStyles];

  protected service = resolve(LocaleService);

  @asyncState()
  protected locales = valueType(this.service.getAll());

  @asyncState()
  protected current = valueType(this.service.get());

  protected override render(): TemplateResult | void {
    if (!this.current || !this.locales?.length || this.locales.length < 2)
      return;

    return html`
      <oryx-dropdown vertical-align position="start">
        <oryx-button type=${ButtonType.Text} slot="trigger">
          <button>
            ${this.getCode(this.current)}
            <oryx-icon type="dropdown"></oryx-icon>
          </button>
        </oryx-button>
        ${repeat(
          this.locales ?? [],
          (locale) => locale.code,
          (locale) =>
            html` <oryx-option
              close-popover
              value=${locale.code}
              ?active=${locale.name === this.current}
              @click=${() => this.onClick(locale.code)}
            >
              ${this.getLabel(locale.code)}
            </oryx-option>`
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(locale: string): void {
    this.service.set(locale);
  }

  protected getLabel(isoCode: string): string {
    const lang = this.getCode(isoCode);
    const languageNames = new Intl.DisplayNames(
      [this.current?.replace('_', '-') ?? 'en-US'],
      {
        type: 'language',
      }
    );
    return languageNames.of(lang) ?? lang;
  }

  protected getCode(isoCode: string): string {
    return isoCode.split('_')[0];
  }
}
