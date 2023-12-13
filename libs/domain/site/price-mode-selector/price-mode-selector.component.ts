import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { Position } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nTranslationValue, hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { PriceModes } from '../src/models';
import { PriceModeService } from '../src/services/price-mode';
import { sitePriceModeSelectorStyles } from './price-mode-selector.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class SitePriceModeSelectorComponent extends ContentMixin(LitElement) {
  static styles = [sitePriceModeSelectorStyles];

  protected priceModeService = resolve(PriceModeService);

  protected $current = signal(this.priceModeService.get());
  protected priceModes: string[] = [PriceModes.GrossMode, PriceModes.NetMode];

  protected override render(): TemplateResult | void {
    return html`
      <oryx-dropdown vertical-align .position=${Position.START}>
        <oryx-button
          slot="trigger"
          .size=${ButtonSize.Md}
          .type=${ButtonType.None}
        >
          ${this.getLabel(this.$current())}
          <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
        </oryx-button>
        ${repeat(
          this.priceModes,
          (priceMode) => priceMode,
          (priceMode) => html`
            <oryx-option
              close-popover
              value=${priceMode}
              ?active=${priceMode === this.$current()}
              @click=${() => this.onClick(priceMode)}
            >
              ${this.getLabel(priceMode)}
            </oryx-option>
          `
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(mode: string): void {
    this.priceModeService.set(mode);
  }

  protected getLabel(priceMode: string): I18nTranslationValue {
    return this.i18n('site.price-mode.<mode>', {
      mode: priceMode.replace('_', ' '),
    });
  }
}
