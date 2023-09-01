import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { take } from 'rxjs';
import { PriceModes } from '../src/models';
import {
  PriceModeChangeGuard,
  PriceModeService,
} from '../src/services/price-mode';
import { sitePriceModeSelectorStyles } from './price-mode-selector.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class SitePriceModeSelectorComponent extends ContentMixin(LitElement) {
  static styles = [sitePriceModeSelectorStyles];

  protected priceModeGuard = resolve(PriceModeChangeGuard);
  protected priceModeService = resolve(PriceModeService);

  protected $current = signal(this.priceModeService.get());
  protected priceModes: string[] = [PriceModes.GrossMode, PriceModes.NetMode];

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

  protected onClick(locale: string): void {
    this.priceModeGuard[0]
      ?.isAllowed()
      .pipe(take(1))
      .subscribe((isAllowed: boolean) => {
        if (isAllowed) {
          this.priceModeService.set(locale);
        } else {
          this.priceModeService.sendNotificationError();

          const optionGrossMode = this.getOptionElement(PriceModes.GrossMode);
          const optionNetMode = this.getOptionElement(PriceModes.NetMode);
          if (this.$current() === PriceModes.GrossMode) {
            optionGrossMode?.setAttribute('active', 'true');
            optionNetMode?.removeAttribute('active');
          } else {
            optionNetMode?.setAttribute('active', 'true');
            optionGrossMode?.removeAttribute('active');
          }
        }
      });
  }

  protected getLabel(priceMode: string): string {
    const priceModeLabel = this.i18n('site.price-mode.<mode>', {
      mode: priceMode.replace('_', ' '),
    }) as string;

    return priceModeLabel;
  }

  private getOptionElement(priceMode: string) {
    return this.renderRoot?.querySelector(`oryx-option[value="${priceMode}"]`);
  }
}
