import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
<<<<<<< HEAD
import { I18nTranslationValue, hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ReplaySubject } from 'rxjs';
=======
import {
  I18nTranslationValue,
  effect,
  elementEffect,
  hydrate,
  signal,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ReplaySubject, switchMap, tap } from 'rxjs';
>>>>>>> feature/hrz-2804-price-mode-component
import { PriceModes } from '../src/models';
import { PriceModeService } from '../src/services/price-mode';
import { sitePriceModeSelectorStyles } from './price-mode-selector.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class SitePriceModeSelectorComponent extends ContentMixin(LitElement) {
  static styles = [sitePriceModeSelectorStyles];

  protected priceModeService = resolve(PriceModeService);

  protected $current = signal(this.priceModeService.get());
  protected triggerMode$ = new ReplaySubject<string>(1);
  protected priceModes: string[] = [PriceModes.GrossMode, PriceModes.NetMode];
  // protected $setMode = signal(
  //   this.triggerMode$.pipe(switchMap((mode) => this.priceModeService.set(mode)))
  // );

  // @elementEffect()
  // protected modeEffect = effect(() => this.$setMode());

  protected override render(): TemplateResult | void {
    return html`
      <oryx-dropdown vertical-align position="start">
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
    // this.triggerMode$.next(mode);
    this.priceModeService.set(mode);
  }

  protected getLabel(priceMode: string): I18nTranslationValue {
    return this.i18n('site.price-mode.<mode>', {
      mode: priceMode.replace('_', ' '),
    });
  }

  private getOptionElement(priceMode: string) {
    return this.renderRoot?.querySelector(`oryx-option[value="${priceMode}"]`);
  }
}
