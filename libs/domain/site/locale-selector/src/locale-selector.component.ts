import { hydrateAllEvent } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  ComponentsRegistryService,
  ContentMixin,
} from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { asyncState, hydratable, valueType } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';
import { SiteLocaleSelectorOptions } from './locale-selector.model';
import { siteLocaleSelectorStyles } from './locale-selector.styles';

@hydratable(['mouseover', 'focusin'])
export class SiteLocaleSelectorComponent extends ContentMixin<SiteLocaleSelectorOptions>(
  LitElement
) {
  static styles = [siteLocaleSelectorStyles];

  protected localeService = resolve(LocaleService);
  protected registry = resolve(ComponentsRegistryService);

  @asyncState()
  protected locales = valueType(this.localeService.getAll());

  @asyncState()
  protected current = valueType(this.localeService.get());

  protected override render(): TemplateResult | void {
    if (!this.current || !this.locales?.length || this.locales.length < 2) {
      return;
    }

    return html`
      <oryx-dropdown vertical-align position="start">
        <oryx-button type=${ButtonType.Text} slot="trigger">
          <button>
            ${this.current}
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
              ?active=${locale.code === this.current}
              @click=${() => this.onClick(locale.code)}
            >
              ${this.getLabel(locale.code)}
            </oryx-option>`
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(locale: string): void {
    document.dispatchEvent(
      new CustomEvent(hydrateAllEvent, {
        composed: true,
        bubbles: true,
      })
    );
    this.localeService.set(locale);
  }

  protected getLabel(code: string): string {
    const languageNames = new Intl.DisplayNames([this.current ?? 'en'], {
      type: 'language',
    });
    return languageNames.of(code) ?? code;
  }
}
